"use client";

import { useMemo } from "react";
import { useClientData } from "./client-data-context";
import { urgencyOrder } from "./config";
import type { SolutionUrgency } from "@/lib/types";

export function useComputedData() {
  const { client } = useClientData();

  return useMemo(() => {
    const invoices = client.invoices;
    const anomalies = client.anomalies;
    const solutions = client.proposed_solutions;

    const totalAnnualCost = invoices.reduce((sum, inv) => sum + inv.total_cost, 0);
    const avgMonthly = invoices.length > 0 ? totalAnnualCost / invoices.length : 0;
    const avgPF = invoices.length > 0
      ? invoices.reduce((sum, inv) => sum + inv.power_factor, 0) / invoices.length
      : 0;
    const totalPFPenalty = invoices.reduce((sum, inv) => sum + inv.cost_power_factor, 0);
    const totalAnomalyImpact = anomalies
      .filter((a) => a.status === "active")
      .reduce((sum, a) => sum + a.financial_impact_monthly, 0);
    const totalPotentialSavings = solutions.reduce((sum, s) => sum + s.annual_savings, 0);
    const maxDemand = invoices.length > 0 ? Math.max(...invoices.map((i) => i.demand_max_kw)) : 0;
    const demandExceedCount = invoices.filter(
      (i) => i.demand_max_kw > client.contracted_demand_kw
    ).length;

    const consumptionBreakdown = invoices.map((inv) => ({
      period: inv.period.slice(0, 3),
      base: inv.consumption_base_kwh,
      intermedia: inv.consumption_intermedia_kwh,
      punta: inv.consumption_punta_kwh,
    }));

    const demandData = invoices.map((inv) => ({
      period: inv.period.slice(0, 3),
      max: inv.demand_max_kw,
      contracted: client.contracted_demand_kw,
    }));

    const pfData = invoices.map((inv) => ({
      period: inv.period.slice(0, 3),
      pf: inv.power_factor,
      penalty: inv.power_factor_penalty_pct,
    }));

    const sortedSolutions = [...solutions].sort(
      (a, b) =>
        (urgencyOrder[a.urgency as SolutionUrgency] ?? 2) - (urgencyOrder[b.urgency as SolutionUrgency] ?? 2) ||
        a.roi_months - b.roi_months
    );
    const totalInvestment = solutions.reduce((s, sol) => s + sol.investment, 0);
    const totalMonthlySavings = solutions.reduce((s, sol) => s + sol.monthly_savings, 0);
    const totalCO2 = solutions.reduce((s, sol) => s + sol.co2_reduction_tons, 0);

    return {
      totalAnnualCost,
      avgMonthly,
      avgPF,
      totalPFPenalty,
      totalAnomalyImpact,
      totalPotentialSavings,
      maxDemand,
      demandExceedCount,
      consumptionBreakdown,
      demandData,
      pfData,
      sortedSolutions,
      totalInvestment,
      totalMonthlySavings,
      totalCO2,
    };
  }, [client]);
}
