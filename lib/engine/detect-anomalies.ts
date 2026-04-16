import type { CFEInvoice, Anomaly, AnomalyCategory, AnomalySeverity } from "@/lib/types";
import { POWER_FACTOR_THRESHOLDS } from "@/lib/standards/cfe-cre";

interface DetectOptions {
  orgId: string;
  contractedDemandKw: number;
}

let anomalyCounter = 0;
function nextId() {
  return `anom-${Date.now()}-${++anomalyCounter}`;
}

export function detectAnomalies(
  invoices: CFEInvoice[],
  opts: DetectOptions
): Anomaly[] {
  if (invoices.length < 3) return [];

  const anomalies: Anomaly[] = [];
  const { orgId, contractedDemandKw } = opts;

  // ─── 1. Power Factor ───
  const avgPF =
    invoices.reduce((s, i) => s + i.power_factor, 0) / invoices.length;
  const monthlyPFPenalty =
    invoices.reduce((s, i) => s + i.cost_power_factor, 0) / invoices.length;

  const pfThreshold =
    contractedDemandKw >= 1000
      ? POWER_FACTOR_THRESHOLDS.minimum_over_1mw.value
      : POWER_FACTOR_THRESHOLDS.minimum_under_1mw.value;

  if (avgPF < pfThreshold) {
    const severity: AnomalySeverity = avgPF < 0.85 ? "critical" : "high";
    anomalies.push({
      id: nextId(),
      client_id: orgId,
      source: "cfe",
      severity,
      category: "power_factor",
      title: `Factor de potencia bajo (${avgPF.toFixed(2)} promedio)`,
      description: `El factor de potencia promedio es ${avgPF.toFixed(2)}, por debajo del minimo de ${pfThreshold}. Esto genera penalizaciones mensuales promedio de $${Math.round(monthlyPFPenalty).toLocaleString()} MXN. Se requiere banco de capacitores para correccion.`,
      detected_at: new Date().toISOString(),
      financial_impact_monthly: Math.round(monthlyPFPenalty),
      status: "active",
    });
  }

  // ─── 2. Demand Overrun ───
  const overrunMonths = invoices.filter(
    (i) => i.demand_max_kw > contractedDemandKw
  );

  if (overrunMonths.length >= 3) {
    const avgExcess =
      overrunMonths.reduce(
        (s, i) => s + (i.demand_max_kw - contractedDemandKw),
        0
      ) / overrunMonths.length;
    // Approximate demand cost per kW from invoices
    const avgDemandCostPerKw =
      invoices.reduce((s, i) => s + i.cost_demand, 0) /
      invoices.reduce((s, i) => s + i.demand_billed_kw, 0);
    const monthlyImpact = Math.round(avgExcess * avgDemandCostPerKw);

    anomalies.push({
      id: nextId(),
      client_id: orgId,
      source: "cfe",
      severity: "high",
      category: "demand_overrun",
      title: `Exceso de demanda en ${overrunMonths.length} periodos`,
      description: `La demanda maxima supera los ${contractedDemandKw} kW contratados en ${overrunMonths.length} de ${invoices.length} periodos. El exceso promedio es de ${Math.round(avgExcess)} kW, generando cargos adicionales estimados de $${monthlyImpact.toLocaleString()} MXN/mes.`,
      detected_at: new Date().toISOString(),
      financial_impact_monthly: monthlyImpact,
      status: "active",
    });
  }

  // ─── 3. Peak Consumption Ratio ───
  const avgPuntaRatio =
    invoices.reduce(
      (s, i) => s + (i.total_kwh > 0 ? i.consumption_punta_kwh / i.total_kwh : 0),
      0
    ) / invoices.length;

  if (avgPuntaRatio > 0.15) {
    const puntaCost =
      invoices.reduce((s, i) => s + i.cost_energy, 0) * avgPuntaRatio * 0.3; // punta is ~30% more expensive
    const monthlyImpact = Math.round(puntaCost / invoices.length);

    anomalies.push({
      id: nextId(),
      client_id: orgId,
      source: "cfe",
      severity: "high",
      category: "consumption_spike",
      title: `Alto consumo en horario punta (${(avgPuntaRatio * 100).toFixed(1)}%)`,
      description: `El consumo en periodo punta representa ${(avgPuntaRatio * 100).toFixed(1)}% del total, superior al 15% recomendado. Esto indica oportunidad de desplazar carga a horarios mas economicos o instalar generacion solar/almacenamiento.`,
      detected_at: new Date().toISOString(),
      financial_impact_monthly: monthlyImpact,
      status: "active",
    });
  }

  // ─── 4. Cost Volatility ───
  const costs = invoices.map((i) => i.total_cost);
  for (let i = 1; i < costs.length; i++) {
    if (costs[i - 1] > 0) {
      const change = (costs[i] - costs[i - 1]) / costs[i - 1];
      if (change > 0.25) {
        anomalies.push({
          id: nextId(),
          client_id: orgId,
          source: "cfe",
          severity: "medium",
          category: "billing_error",
          title: `Incremento anomalo de costo (+${(change * 100).toFixed(0)}%)`,
          description: `El costo del periodo ${invoices[i].period} aumento ${(change * 100).toFixed(0)}% respecto al anterior ($${Math.round(costs[i - 1]).toLocaleString()} -> $${Math.round(costs[i]).toLocaleString()}). Verificar si corresponde a aumento real de consumo o error de facturacion.`,
          detected_at: new Date().toISOString(),
          period: invoices[i].period,
          financial_impact_monthly: Math.round(costs[i] - costs[i - 1]),
          status: "active",
        });
        break; // Only report the worst one
      }
    }
  }

  // ─── 5. Base Load Energy Waste ───
  const minBaseKwh = Math.min(...invoices.map((i) => i.consumption_base_kwh));
  // Estimate base load power: min base kWh / hours in period
  // Assuming ~720 hours per bimester (30 days * 24h) in base period (~50% of time)
  const estimatedBasePowerKw = minBaseKwh / 360;
  if (estimatedBasePowerKw > 60) {
    const wasteKwh = estimatedBasePowerKw * 0.3 * 720; // 30% potential reduction
    const avgRate =
      invoices.reduce((s, i) => s + i.cost_energy, 0) /
      invoices.reduce((s, i) => s + i.total_kwh, 0);
    const monthlyImpact = Math.round(wasteKwh * avgRate);

    anomalies.push({
      id: nextId(),
      client_id: orgId,
      source: "cfe",
      severity: "medium",
      category: "energy_waste",
      title: `Carga base elevada (~${Math.round(estimatedBasePowerKw)} kW)`,
      description: `El consumo base minimo sugiere una carga nocturna/fines de semana de ~${Math.round(estimatedBasePowerKw)} kW. Revisar equipos que permanecen encendidos innecesariamente (iluminacion, HVAC, compresores). Potencial de ahorro: ${Math.round(wasteKwh).toLocaleString()} kWh/periodo.`,
      detected_at: new Date().toISOString(),
      financial_impact_monthly: monthlyImpact,
      status: "active",
    });
  }

  return anomalies;
}
