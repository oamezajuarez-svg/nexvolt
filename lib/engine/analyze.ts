"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { detectAnomalies } from "./detect-anomalies";
import { recommendSolutions } from "./recommend-solutions";
import type { CFEInvoice } from "@/lib/types";

export async function runAnalysis(orgId: string): Promise<{
  anomalyCount: number;
  solutionCount: number;
  error?: string;
}> {
  // Verify auth
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { anomalyCount: 0, solutionCount: 0, error: "No autenticado" };
  }

  const admin = createAdminClient();

  // Fetch org data
  const { data: org } = await admin
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();

  if (!org) {
    return { anomalyCount: 0, solutionCount: 0, error: "Organizacion no encontrada" };
  }

  // Fetch invoices
  const { data: rawInvoices } = await admin
    .from("cfe_invoices")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: true });

  if (!rawInvoices || rawInvoices.length < 3) {
    return {
      anomalyCount: 0,
      solutionCount: 0,
      error: `Se necesitan al menos 3 recibos para el analisis. Actualmente hay ${rawInvoices?.length ?? 0}.`,
    };
  }

  // Map to typed invoices
  const invoices: CFEInvoice[] = rawInvoices.map((inv) => ({
    id: inv.id,
    client_id: inv.organization_id,
    period: inv.period,
    month_index: inv.month_index ?? 0,
    consumption_base_kwh: inv.consumption_base_kwh ?? 0,
    consumption_intermedia_kwh: inv.consumption_intermedia_kwh ?? 0,
    consumption_punta_kwh: inv.consumption_punta_kwh ?? 0,
    total_kwh: inv.total_kwh ?? 0,
    demand_max_kw: inv.demand_max_kw ?? 0,
    demand_contracted_kw: inv.demand_contracted_kw ?? org.contracted_demand_kw ?? 0,
    demand_billed_kw: inv.demand_billed_kw ?? 0,
    power_factor: inv.power_factor ?? 0,
    power_factor_penalty_pct: inv.power_factor_penalty_pct ?? 0,
    cost_energy: inv.cost_energy ?? 0,
    cost_demand: inv.cost_demand ?? 0,
    cost_distribution: inv.cost_distribution ?? 0,
    cost_transmission: inv.cost_transmission ?? 0,
    cost_power_factor: inv.cost_power_factor ?? 0,
    subtotal: inv.subtotal ?? 0,
    iva: inv.iva ?? 0,
    total_cost: inv.total_cost ?? 0,
    tariff: inv.tariff ?? org.tariff ?? "GDMTH",
  }));

  // Run anomaly detection
  const anomalies = detectAnomalies(invoices, {
    orgId,
    contractedDemandKw: org.contracted_demand_kw ?? 0,
  });

  // Run solution recommendation
  const solutions = recommendSolutions(invoices, anomalies, {
    orgId,
    tariff: org.tariff ?? "GDMTH",
    contractedDemandKw: org.contracted_demand_kw ?? 0,
  });

  // Clear previous analysis results
  await admin.from("anomalies").delete().eq("organization_id", orgId);
  await admin.from("proposed_solutions").delete().eq("organization_id", orgId);

  // Insert new anomalies
  if (anomalies.length > 0) {
    await admin.from("anomalies").insert(
      anomalies.map((a) => ({
        organization_id: orgId,
        source: a.source as "cfe" | "monitoring",
        severity: a.severity as "critical" | "high" | "medium" | "low",
        category: a.category,
        title: a.title,
        description: a.description,
        period: a.period ?? null,
        financial_impact_monthly: a.financial_impact_monthly,
        status: a.status as "active" | "acknowledged" | "resolved",
      }))
    );
  }

  // Insert new solutions
  if (solutions.length > 0) {
    await admin.from("proposed_solutions").insert(
      solutions.map((s) => ({
        organization_id: orgId,
        anomaly_ids: s.anomaly_ids,
        type: s.type,
        name: s.name,
        description: s.description,
        urgency: s.urgency as "immediate" | "short_term" | "medium_term",
        impact: s.impact as "high" | "medium" | "low",
        investment: s.investment,
        monthly_savings: s.monthly_savings,
        annual_savings: s.annual_savings,
        roi_months: s.roi_months,
        payback_date: s.payback_date,
        co2_reduction_tons: s.co2_reduction_tons,
        status: s.status as "proposed" | "approved" | "rejected" | "installed",
      }))
    );
  }

  // Update org monthly_cost with average
  const avgMonthlyCost =
    invoices.reduce((s, i) => s + i.total_cost, 0) / invoices.length;
  await admin
    .from("organizations")
    .update({
      monthly_cost: Math.round(avgMonthlyCost),
      status: "active" as const,
    })
    .eq("id", orgId);

  return {
    anomalyCount: anomalies.length,
    solutionCount: solutions.length,
  };
}
