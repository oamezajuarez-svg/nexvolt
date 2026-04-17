import { createAdminClient } from "@/lib/supabase/admin";
import { mockClientDetail } from "@/lib/mock-client-detail";
import type { ClientDetail, CFEInvoice, Anomaly, ProposedSolution, MonitoringDevice } from "@/lib/types";

// UUIDs are 36 chars with dashes. Anything else is a demo/mock ID.
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isDemoId(id: string): boolean {
  return id === "demo" || !UUID_REGEX.test(id);
}

export async function fetchClientDetail(
  orgId: string
): Promise<ClientDetail | null> {
  // Demo mode -- return mock data for non-UUID IDs
  if (isDemoId(orgId)) {
    return mockClientDetail;
  }

  const admin = createAdminClient();

  // Fetch all data in parallel
  const [orgResult, invoicesResult, anomaliesResult, solutionsResult, devicesResult] =
    await Promise.all([
      admin.from("organizations").select("*").eq("id", orgId).single(),
      admin
        .from("cfe_invoices")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: true }),
      admin
        .from("anomalies")
        .select("*")
        .eq("organization_id", orgId)
        .order("detected_at", { ascending: false }),
      admin
        .from("proposed_solutions")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: true }),
      admin
        .from("monitoring_devices")
        .select("*")
        .eq("organization_id", orgId),
    ]);

  if (orgResult.error || !orgResult.data) {
    return null;
  }

  const org = orgResult.data;
  const invoices = (invoicesResult.data ?? []).map(
    (inv): CFEInvoice => ({
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
    })
  );

  const anomalies = (anomaliesResult.data ?? []).map(
    (a): Anomaly => ({
      id: a.id,
      client_id: a.organization_id,
      source: a.source,
      severity: a.severity,
      category: (a.category ?? "energy_waste") as Anomaly["category"],
      title: a.title,
      description: a.description ?? "",
      detected_at: a.detected_at,
      period: a.period ?? undefined,
      financial_impact_monthly: a.financial_impact_monthly ?? 0,
      status: a.status,
    })
  );

  const solutions = (solutionsResult.data ?? []).map(
    (s): ProposedSolution => ({
      id: s.id,
      client_id: s.organization_id,
      anomaly_ids: s.anomaly_ids ?? [],
      type: (s.type ?? "led") as ProposedSolution["type"],
      name: s.name,
      description: s.description ?? "",
      urgency: (s.urgency ?? "medium_term") as ProposedSolution["urgency"],
      impact: (s.impact ?? "medium") as ProposedSolution["impact"],
      investment: s.investment ?? 0,
      monthly_savings: s.monthly_savings ?? 0,
      annual_savings: s.annual_savings ?? 0,
      roi_months: s.roi_months ?? 0,
      payback_date: s.payback_date ?? "",
      co2_reduction_tons: s.co2_reduction_tons ?? 0,
      status: s.status,
    })
  );

  const devices = (devicesResult.data ?? []).map(
    (d): MonitoringDevice => ({
      id: d.id,
      client_id: d.organization_id,
      name: d.name ?? "",
      model: d.model ?? "",
      location: d.location ?? "",
      status: (d.status ?? "offline") as MonitoringDevice["status"],
      last_reading: d.last_reading as unknown as MonitoringDevice["last_reading"],
    })
  );

  return {
    id: org.id,
    name: org.name,
    rfc: org.rfc ?? "",
    industry: org.industry ?? "",
    location: org.location ?? "",
    status: org.status,
    tariff: org.tariff ?? "",
    monthly_cost: org.monthly_cost ?? 0,
    created_at: org.created_at,
    contact_name: org.contact_name ?? "",
    contact_email: org.contact_email ?? "",
    contact_phone: org.contact_phone ?? "",
    contracted_demand_kw: org.contracted_demand_kw ?? 0,
    supply_voltage: org.supply_voltage ?? "",
    meter_number: org.meter_number ?? "",
    rpu: org.rpu ?? "",
    invoices,
    anomalies,
    proposed_solutions: solutions,
    monitoring_devices: devices,
  };
}
