"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Wrench } from "lucide-react";
import {
  client,
  solutionTypeConfig,
  urgencyConfig,
  urgencyOrder,
  solEffects,
} from "../shared/config";

function computeSimulatedBill(activeIds: Set<string>) {
  const n = client.invoices.length;
  let avgEnergy = Math.round(client.invoices.reduce((s, i) => s + i.cost_energy, 0) / n);
  let avgDemandCost = Math.round(client.invoices.reduce((s, i) => s + i.cost_demand, 0) / n);
  let avgDist = Math.round(client.invoices.reduce((s, i) => s + i.cost_distribution + i.cost_transmission, 0) / n);
  let avgDemandKw = Math.round(client.invoices.reduce((s, i) => s + i.demand_max_kw, 0) / n);
  let pf = client.invoices.reduce((s, i) => s + i.power_factor, 0) / n;
  const avgKwh = Math.round(client.invoices.reduce((s, i) => s + i.total_kwh, 0) / n);
  const demandRate = avgDemandCost / avgDemandKw;

  // Apply effects
  for (const id of activeIds) {
    const fx = solEffects[id];
    if (!fx) continue;
    if (fx.pfOverride && fx.pfOverride > pf) pf = fx.pfOverride;
    if (fx.demandCutKw) {
      avgDemandKw = Math.max(client.contracted_demand_kw, avgDemandKw - fx.demandCutKw);
      avgDemandCost = Math.round(avgDemandKw * demandRate);
    }
    if (fx.energyPct) avgEnergy = Math.round(avgEnergy * fx.energyPct);
    if (fx.demandCostPct) avgDemandCost = Math.round(avgDemandCost * fx.demandCostPct);
    if (fx.distPct) avgDist = Math.round(avgDist * fx.distPct);
  }

  const base = avgEnergy + avgDemandCost + avgDist;
  let costPF: number;
  if (pf >= 0.90) {
    costPF = -Math.round(base * (1 - 0.90 / pf));
  } else {
    costPF = Math.round(base * ((0.90 / pf) - 1));
  }
  const sub = base + costPF;
  const iva = Math.round(sub * 0.16);
  return { avgEnergy, avgDemandCost, avgDist, costPF, pf, sub, iva, total: sub + iva, avgDemandKw, avgKwh };
}

export function SimulatorSection({
  selected,
  setSelected,
}: {
  selected: Set<string>;
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const original = computeSimulatedBill(new Set());
  const simulated = computeSimulatedBill(selected);
  const saved = original.total - simulated.total;
  const pct = original.total > 0 ? (saved / original.total) * 100 : 0;

  // Order solutions by urgency
  const ordered = [...client.proposed_solutions].sort(
    (a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency] || a.roi_months - b.roi_months
  );

  return (
    <div className="space-y-6">
      {/* Big bill display */}
      <div className="rounded-2xl border border-nx-border bg-nx-card p-8 text-center">
        <p className="text-xs text-nx-text-muted uppercase tracking-widest mb-2">
          Recibo CFE promedio mensual
        </p>
        <div className="relative inline-block">
          <p className={`text-6xl font-bold tracking-tight transition-all duration-500 ${selected.size > 0 ? "text-nx-accent" : "text-nx-text"}`}>
            {formatCurrency(simulated.total)}
          </p>
          {selected.size > 0 && (
            <p className="text-sm text-nx-text-muted mt-1 line-through">
              {formatCurrency(original.total)}
            </p>
          )}
        </div>
        {selected.size > 0 && (
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-nx-accent">-{formatCurrency(saved)}</p>
              <p className="text-xs text-nx-text-muted">ahorro/mes</p>
            </div>
            <div className="h-8 w-px bg-nx-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-nx-accent">-{pct.toFixed(0)}%</p>
              <p className="text-xs text-nx-text-muted">reduccion</p>
            </div>
            <div className="h-8 w-px bg-nx-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-nx-accent">{formatCurrency(saved * 12)}</p>
              <p className="text-xs text-nx-text-muted">ahorro/año</p>
            </div>
          </div>
        )}
        {selected.size === 0 && (
          <p className="text-sm text-nx-text-muted mt-4">
            Selecciona soluciones abajo para ver como baja el recibo
          </p>
        )}

        {/* Progress bar */}
        <div className="mt-6 max-w-lg mx-auto">
          <div className="flex items-center justify-between text-xs text-nx-text-muted mb-1">
            <span>Recibo actual</span>
            <span>Meta: {formatCurrency(original.total - original.total * 0.5)}</span>
          </div>
          <div className="h-3 rounded-full bg-nx-surface overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-nx-danger via-nx-warning to-nx-accent transition-all duration-700 ease-out"
              style={{ width: `${100 - pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Solution cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-nx-text">
            Selecciona las soluciones a implementar
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setSelected(new Set(client.proposed_solutions.map((s) => s.id)))}
              className="text-xs text-nx-primary hover:underline"
            >
              Seleccionar todas
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-nx-text-muted hover:underline"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ordered.map((sol) => {
            const isOn = selected.has(sol.id);
            const tcfg = solutionTypeConfig[sol.type];
            const ucfg = urgencyConfig[sol.urgency];
            const Icon = tcfg?.icon || Wrench;

            // Calculate marginal savings of this solution
            const without = new Set(selected);
            without.delete(sol.id);
            const withoutBill = computeSimulatedBill(without);
            const withBill = computeSimulatedBill(new Set([...selected, sol.id]));
            const marginal = withoutBill.total - withBill.total;

            return (
              <button
                key={sol.id}
                onClick={() => toggle(sol.id)}
                className={`rounded-xl border p-4 text-left transition-all duration-300 ${
                  isOn
                    ? "border-nx-accent/40 bg-nx-accent-bg ring-1 ring-nx-accent/20 scale-[1.02]"
                    : "border-nx-border bg-nx-card hover:border-nx-border-hover hover:bg-nx-surface/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOn ? "border-nx-accent bg-nx-accent" : "border-nx-border"
                  }`}>
                    {isOn && <CheckCircle2 className="h-3.5 w-3.5 text-nx-bg" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Icon + label */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`rounded-lg p-1.5 ${tcfg?.bg || "bg-nx-surface"}`}>
                        <Icon className={`h-4 w-4 ${tcfg?.color || "text-nx-text-muted"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-nx-text">{tcfg?.label || sol.type}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-nx-text-muted leading-relaxed mb-2">
                      {tcfg?.description || ""}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-nx-text-muted">Inv: </span>
                        <span className="text-nx-text font-medium">{formatCurrency(sol.investment)}</span>
                      </div>
                      <div>
                        <span className="text-nx-text-muted">ROI: </span>
                        <span className="text-nx-primary font-medium">{sol.roi_months.toFixed(0)} meses</span>
                      </div>
                    </div>

                    {/* Marginal savings */}
                    <div className={`mt-2 rounded-lg px-2 py-1 text-xs font-semibold transition-all duration-300 ${
                      isOn ? "bg-nx-accent/20 text-nx-accent" : "bg-nx-surface text-nx-text-muted"
                    }`}>
                      {marginal > 0 ? `-${formatCurrency(marginal)}/mes en tu recibo` : "Sin efecto marginal adicional"}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Breakdown comparison */}
      {selected.size > 0 && (
        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-4">Desglose del recibo simulado</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-nx-border text-left text-nx-text-muted">
                  <th className="pb-2 font-medium">Concepto</th>
                  <th className="pb-2 font-medium text-right">Actual</th>
                  <th className="pb-2 font-medium text-right">Simulado</th>
                  <th className="pb-2 font-medium text-right">Diferencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nx-border">
                {[
                  { label: "Cargo por energia", orig: original.avgEnergy, sim: simulated.avgEnergy },
                  { label: "Cargo por demanda", orig: original.avgDemandCost, sim: simulated.avgDemandCost },
                  { label: "Distribucion + transmision", orig: original.avgDist, sim: simulated.avgDist },
                  { label: `Factor de potencia (FP: ${original.pf.toFixed(2)} → ${simulated.pf.toFixed(2)})`, orig: original.costPF, sim: simulated.costPF, isPF: true },
                  { label: "Subtotal", orig: original.sub, sim: simulated.sub, bold: true },
                  { label: "IVA (16%)", orig: original.iva, sim: simulated.iva },
                ].map((row) => {
                  const diff = row.sim - row.orig;
                  return (
                    <tr key={row.label}>
                      <td className={`py-2 ${row.bold ? "font-semibold text-nx-text" : "text-nx-text-secondary"}`}>{row.label}</td>
                      <td className="py-2 text-right text-nx-text">{formatCurrency(row.orig)}</td>
                      <td className={`py-2 text-right font-medium ${row.isPF && row.sim < 0 ? "text-nx-accent" : "text-nx-primary"}`}>
                        {formatCurrency(row.sim)}
                      </td>
                      <td className={`py-2 text-right font-medium ${diff < 0 ? "text-nx-accent" : diff > 0 ? "text-nx-danger" : "text-nx-text-muted"}`}>
                        {diff === 0 ? "—" : `${diff < 0 ? "" : "+"}${formatCurrency(diff)}`}
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-nx-border">
                  <td className="pt-3 font-bold text-nx-text text-sm">TOTAL A PAGAR</td>
                  <td className="pt-3 text-right font-bold text-nx-danger text-sm">{formatCurrency(original.total)}</td>
                  <td className="pt-3 text-right font-bold text-nx-accent text-sm">{formatCurrency(simulated.total)}</td>
                  <td className="pt-3 text-right font-bold text-nx-accent text-sm">-{formatCurrency(saved)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Annual summary */}
          <div className="mt-4 grid grid-cols-4 gap-4 rounded-lg bg-nx-accent-bg border border-nx-accent/20 p-4">
            <div className="text-center">
              <p className="text-[10px] text-nx-text-muted uppercase">Ahorro mensual</p>
              <p className="text-lg font-bold text-nx-accent">{formatCurrency(saved)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-nx-text-muted uppercase">Ahorro anual</p>
              <p className="text-lg font-bold text-nx-accent">{formatCurrency(saved * 12)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-nx-text-muted uppercase">Inversion total</p>
              {(() => {
                const totalInvestment = client.proposed_solutions
                  .filter((s) => selected.has(s.id))
                  .reduce((sum, s) => sum + s.investment, 0);
                return (
                  <>
                    <p className="text-lg font-bold text-nx-text">
                      {formatCurrency(totalInvestment)}
                    </p>
                    </>
                );
              })()}
            </div>
            <div className="text-center">
              <p className="text-[10px] text-nx-text-muted uppercase">ROI</p>
              <p className="text-lg font-bold text-nx-primary">
                {saved > 0
                  ? `${(
                      client.proposed_solutions
                        .filter((s) => selected.has(s.id))
                        .reduce((sum, s) => sum + s.investment, 0) /
                      (saved * 12)
                    ).toFixed(1)} años`
                  : "—"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Methodology */}
      <div className="rounded-lg bg-nx-surface/50 border border-nx-border px-4 py-3">
        <p className="text-[11px] text-nx-text-muted leading-relaxed">
          <strong className="text-nx-text-secondary">Base del calculo:</strong>{" "}
          El recibo promedio se calcula con los {client.invoices.length} recibos CFE cargados ({client.invoices[0]?.period} — {client.invoices[client.invoices.length - 1]?.period}).
          Cada solucion modifica parametros especificos:{" "}
          <strong>Capacitores</strong> → FP a 0.96 (bonificacion).{" "}
          <strong>BESS</strong> → -50 kW demanda, -7% energia.{" "}
          <strong>Solar FV</strong> → -35% energia.{" "}
          <strong>LED</strong> → -12% energia.{" "}
          <strong>Filtros</strong> → -3% perdidas.{" "}
          <strong>Rebalanceo</strong> → -2% perdidas.{" "}
          Tarifas unitarias basadas en tarifa {client.tariff}.
        </p>
      </div>
    </div>
  );
}
