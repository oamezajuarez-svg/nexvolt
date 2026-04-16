import type { CFEInvoice, Anomaly, ProposedSolution, SolutionType } from "@/lib/types";
import { EMISSION_FACTORS } from "@/lib/standards/emissions";
import { addMonths, format } from "date-fns";

interface RecommendOptions {
  orgId: string;
  tariff: string;
  contractedDemandKw: number;
}

let solutionCounter = 0;
function nextId() {
  return `sol-${Date.now()}-${++solutionCounter}`;
}

// MXN to USD approximate rate for equipment pricing
const USD_TO_MXN = 17.5;

export function recommendSolutions(
  invoices: CFEInvoice[],
  anomalies: Anomaly[],
  opts: RecommendOptions
): ProposedSolution[] {
  if (anomalies.length === 0) return [];

  const solutions: ProposedSolution[] = [];
  const now = new Date();

  const avgMonthlyKwh =
    invoices.reduce((s, i) => s + i.total_kwh, 0) / invoices.length;
  const avgRate =
    invoices.reduce((s, i) => s + i.cost_energy, 0) /
    invoices.reduce((s, i) => s + i.total_kwh, 0);

  for (const anomaly of anomalies) {
    switch (anomaly.category) {
      // ─── Power Factor -> Capacitor Bank ───
      case "power_factor": {
        const avgPF =
          invoices.reduce((s, i) => s + i.power_factor, 0) / invoices.length;
        const avgKw =
          invoices.reduce((s, i) => s + i.demand_max_kw, 0) / invoices.length;
        const targetPF = 0.95;

        // kVAR = kW × (tan(acos(currentPF)) - tan(acos(targetPF)))
        const currentAngle = Math.acos(avgPF);
        const targetAngle = Math.acos(targetPF);
        const kvarNeeded = avgKw * (Math.tan(currentAngle) - Math.tan(targetAngle));

        // Cost: ~$50-70 USD per kVAR installed
        const costPerKvar = 60 * USD_TO_MXN;
        const investment = Math.round(kvarNeeded * costPerKvar);

        // Savings: eliminate PF penalties
        const annualPFPenalty =
          invoices.reduce((s, i) => s + i.cost_power_factor, 0) *
          (12 / invoices.length);
        const monthlySavings = Math.round(annualPFPenalty / 12);
        const annualSavings = Math.round(annualPFPenalty);
        const roiMonths = investment > 0 ? Math.round((investment / monthlySavings) * 10) / 10 : 0;

        const co2 = (annualSavings / avgRate / 1000) * EMISSION_FACTORS.sen_current.value;

        solutions.push({
          id: nextId(),
          client_id: opts.orgId,
          anomaly_ids: [anomaly.id],
          type: "capacitor_bank",
          name: `Banco de capacitores (${Math.round(kvarNeeded)} kVAR)`,
          description: `Instalacion de banco de capacitores automatico de ${Math.round(kvarNeeded)} kVAR para corregir el factor de potencia de ${avgPF.toFixed(2)} a ${targetPF}. Elimina penalizaciones de CFE por bajo FP.`,
          urgency: "immediate",
          impact: "high",
          investment,
          monthly_savings: monthlySavings,
          annual_savings: annualSavings,
          roi_months: roiMonths,
          payback_date: format(addMonths(now, Math.ceil(roiMonths)), "yyyy-MM-dd"),
          co2_reduction_tons: Math.round(co2 * 10) / 10,
          status: "proposed",
        });
        break;
      }

      // ─── Demand Overrun -> BESS ───
      case "demand_overrun": {
        const maxDemand = Math.max(...invoices.map((i) => i.demand_max_kw));
        const excessKw = maxDemand - opts.contractedDemandKw;
        // Battery needs to cover peak for ~2 hours
        const batteryKwh = excessKw * 2;
        // Cost: ~$400-600 USD per kWh for commercial BESS
        const costPerKwh = 500 * USD_TO_MXN;
        const investment = Math.round(batteryKwh * costPerKwh);

        const monthlySavings = anomaly.financial_impact_monthly;
        const annualSavings = monthlySavings * 12;
        const roiMonths = investment > 0 ? Math.round((investment / monthlySavings) * 10) / 10 : 0;

        const co2 = (annualSavings / avgRate / 1000) * EMISSION_FACTORS.sen_current.value;

        solutions.push({
          id: nextId(),
          client_id: opts.orgId,
          anomaly_ids: [anomaly.id],
          type: "bess",
          name: `Almacenamiento BESS (${Math.round(batteryKwh)} kWh)`,
          description: `Sistema de almacenamiento de ${Math.round(batteryKwh)} kWh para peak shaving. Reduce la demanda maxima de ${Math.round(maxDemand)} kW a los ${opts.contractedDemandKw} kW contratados, eliminando cargos por sobredemanda.`,
          urgency: "short_term",
          impact: "high",
          investment,
          monthly_savings: monthlySavings,
          annual_savings: annualSavings,
          roi_months: roiMonths,
          payback_date: format(addMonths(now, Math.ceil(roiMonths)), "yyyy-MM-dd"),
          co2_reduction_tons: Math.round(co2 * 10) / 10,
          status: "proposed",
        });
        break;
      }

      // ─── Peak Consumption -> Solar PV ───
      case "consumption_spike": {
        // Size solar to cover ~40% of average consumption
        const targetKwh = avgMonthlyKwh * 0.4;
        // In Mexico: ~5 peak sun hours/day, 30 days, 80% performance ratio
        const systemKwp = targetKwh / (5 * 30 * 0.8);
        // Cost: ~$1,000-1,200 USD per kWp installed in Mexico
        const costPerKwp = 1100 * USD_TO_MXN;
        const investment = Math.round(systemKwp * costPerKwp);

        const annualGenKwh = systemKwp * 5 * 365 * 0.8;
        const annualSavings = Math.round(annualGenKwh * avgRate);
        const monthlySavings = Math.round(annualSavings / 12);
        const roiMonths = investment > 0 ? Math.round((investment / monthlySavings) * 10) / 10 : 0;

        const co2 = (annualGenKwh / 1000) * EMISSION_FACTORS.sen_current.value;

        solutions.push({
          id: nextId(),
          client_id: opts.orgId,
          anomaly_ids: [anomaly.id],
          type: "solar_pv",
          name: `Sistema solar fotovoltaico (${Math.round(systemKwp)} kWp)`,
          description: `Instalacion de ${Math.round(systemKwp)} kWp de paneles solares en techo. Generacion estimada de ${Math.round(annualGenKwh).toLocaleString()} kWh/ano, cubriendo ~40% del consumo actual. Incluye beneficio fiscal Art. 34 LISR (depreciacion acelerada 100% primer ano).`,
          urgency: "short_term",
          impact: "high",
          investment,
          monthly_savings: monthlySavings,
          annual_savings: annualSavings,
          roi_months: roiMonths,
          payback_date: format(addMonths(now, Math.ceil(roiMonths)), "yyyy-MM-dd"),
          co2_reduction_tons: Math.round(co2 * 10) / 10,
          status: "proposed",
        });
        break;
      }

      // ─── Energy Waste -> LED Retrofit ───
      case "energy_waste": {
        // Estimate lighting as 15% of total consumption
        const estimatedLightingKwh = avgMonthlyKwh * 0.15;
        // LED retrofit saves ~50-60% of lighting energy
        const savingsKwh = estimatedLightingKwh * 0.55;
        // Cost: ~$80-120 MXN per replaced fixture
        const estimatedFixtures = Math.round(estimatedLightingKwh / 30); // ~30 kWh/fixture/month
        const investment = Math.round(estimatedFixtures * 100);

        const annualSavingsKwh = savingsKwh * 12;
        const annualSavings = Math.round(annualSavingsKwh * avgRate);
        const monthlySavings = Math.round(annualSavings / 12);
        const roiMonths = investment > 0 ? Math.round((investment / monthlySavings) * 10) / 10 : 0;

        const co2 = (annualSavingsKwh / 1000) * EMISSION_FACTORS.sen_current.value;

        solutions.push({
          id: nextId(),
          client_id: opts.orgId,
          anomaly_ids: [anomaly.id],
          type: "led",
          name: `Retrofit LED (~${estimatedFixtures} luminarias)`,
          description: `Sustitucion de iluminacion existente por LED de alta eficiencia. Ahorro estimado de ${Math.round(annualSavingsKwh).toLocaleString()} kWh/ano. Nota: el dimensionamiento exacto requiere levantamiento de iluminacion en sitio.`,
          urgency: "immediate",
          impact: "medium",
          investment,
          monthly_savings: monthlySavings,
          annual_savings: annualSavings,
          roi_months: roiMonths,
          payback_date: format(addMonths(now, Math.ceil(roiMonths)), "yyyy-MM-dd"),
          co2_reduction_tons: Math.round(co2 * 10) / 10,
          status: "proposed",
        });
        break;
      }

      // ─── Billing Error -> Review ───
      case "billing_error": {
        solutions.push({
          id: nextId(),
          client_id: opts.orgId,
          anomaly_ids: [anomaly.id],
          type: "capacitor_bank" as SolutionType, // closest match for audit/review
          name: "Auditoria de facturacion CFE",
          description: `Se detecto un incremento anomalo en el periodo ${anomaly.period}. Se recomienda solicitar revision de facturacion a CFE y verificar lecturas del medidor. Costo cero si se resuelve administrativamente.`,
          urgency: "immediate",
          impact: "medium",
          investment: 0,
          monthly_savings: anomaly.financial_impact_monthly,
          annual_savings: anomaly.financial_impact_monthly * 12,
          roi_months: 0,
          payback_date: format(now, "yyyy-MM-dd"),
          co2_reduction_tons: 0,
          status: "proposed",
        });
        break;
      }
    }
  }

  // Sort by urgency then ROI
  const urgencyOrder = { immediate: 0, short_term: 1, medium_term: 2 };
  solutions.sort(
    (a, b) =>
      urgencyOrder[a.urgency] - urgencyOrder[b.urgency] ||
      a.roi_months - b.roi_months
  );

  return solutions;
}
