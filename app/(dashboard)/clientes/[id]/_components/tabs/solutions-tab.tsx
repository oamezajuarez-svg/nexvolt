"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingDown,
  DollarSign,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Wrench,
  Clock,
  Flame,
  Leaf,
  Shield,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SolutionUrgency, SolutionImpact } from "@/lib/types";
import {
  client,
  severityConfig,
  urgencyConfig,
  impactConfig,
  solutionTypeConfig,
  totalPotentialSavings,
  totalInvestment,
  totalCO2,
  sortedSolutions,
  tooltipStyle,
} from "../shared/config";

export function SolutionsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group by urgency
  const byUrgency: Record<SolutionUrgency, typeof sortedSolutions> = {
    immediate: sortedSolutions.filter((s) => s.urgency === "immediate"),
    short_term: sortedSolutions.filter((s) => s.urgency === "short_term"),
    medium_term: sortedSolutions.filter((s) => s.urgency === "medium_term"),
  };

  // ROI chart data
  const roiData = sortedSolutions.map((s) => ({
    name:
      (solutionTypeConfig[s.type]?.label || s.type).length > 20
        ? (solutionTypeConfig[s.type]?.label || s.type).slice(0, 20) + "..."
        : solutionTypeConfig[s.type]?.label || s.type,
    investment: s.investment,
    annual_savings: s.annual_savings,
    roi_months: s.roi_months,
    urgency: s.urgency,
    monthly_savings: s.monthly_savings,
  }));

  // Impact/urgency matrix
  const impactOrder: Record<SolutionImpact, number> = { high: 3, medium: 2, low: 1 };

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div className="flex items-center justify-between rounded-lg bg-nx-surface/50 border border-nx-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-nx-text">
              {sortedSolutions.length} soluciones propuestas para {client.anomalies.filter((a) => a.status === "active").length} anomalias activas
            </p>
            <p className="text-[11px] text-nx-text-muted">
              ROI calculado con: inversion a precios de mercado / ahorro mensual estimado por eliminacion de cada anomalia.
              Ahorro = penalizaciones eliminadas + reduccion de consumo + reduccion de demanda. Precios de energia basados en tarifa {client.tariff}.
            </p>
          </div>
        </div>
      </div>

      {/* Executive summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-nx-text-muted" />
            <p className="text-xs text-nx-text-muted">Inversion total</p>
          </div>
          <p className="text-xl font-semibold text-nx-text">{formatCurrency(totalInvestment)}</p>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-nx-accent" />
            <p className="text-xs text-nx-text-muted">Ahorro anual total</p>
          </div>
          <p className="text-xl font-semibold text-nx-accent">
            {formatCurrency(totalPotentialSavings)}
          </p>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-nx-primary" />
            <p className="text-xs text-nx-text-muted">ROI promedio</p>
          </div>
          <p className="text-xl font-semibold text-nx-primary">
            {(
              sortedSolutions.reduce((s, sol) => s + sol.roi_months, 0) /
              sortedSolutions.length
            ).toFixed(1)}{" "}
            meses
          </p>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-nx-danger" />
            <p className="text-xs text-nx-text-muted">Acciones inmediatas</p>
          </div>
          <p className="text-xl font-semibold text-nx-danger">
            {byUrgency.immediate.length}
          </p>
          <p className="text-xs text-nx-text-muted mt-1">
            {formatCurrency(byUrgency.immediate.reduce((s, sol) => s + sol.investment, 0))}
          </p>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-4 w-4 text-nx-accent" />
            <p className="text-xs text-nx-text-muted">CO2 evitado</p>
          </div>
          <p className="text-xl font-semibold text-nx-accent">{totalCO2} ton/año</p>
        </Card>
      </div>

      {/* Matriz de prioridad: Urgencia x Impacto */}
      <Card>
        <h3 className="text-sm font-medium text-nx-text mb-1">
          Matriz de prioridad — Urgencia vs Impacto
        </h3>
        <p className="text-xs text-nx-text-muted mb-4">
          Cuadrante superior-izquierdo = mayor prioridad
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-nx-border">
                <th className="pb-2 text-left text-nx-text-muted font-medium w-40" />
                <th className="pb-2 text-center text-nx-danger font-semibold">
                  Accion inmediata
                </th>
                <th className="pb-2 text-center text-nx-warning font-semibold">
                  Corto plazo
                </th>
                <th className="pb-2 text-center text-nx-primary font-semibold">
                  Mediano plazo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nx-border">
              {(["high", "medium", "low"] as SolutionImpact[]).map((imp) => (
                <tr key={imp}>
                  <td className="py-3 font-medium text-nx-text-secondary">
                    <Badge variant={impactConfig[imp].variant}>
                      {impactConfig[imp].label}
                    </Badge>
                  </td>
                  {(["immediate", "short_term", "medium_term"] as SolutionUrgency[]).map(
                    (urg) => {
                      const sols = sortedSolutions.filter(
                        (s) => s.urgency === urg && s.impact === imp
                      );
                      return (
                        <td key={urg} className="py-3 text-center align-top">
                          {sols.length > 0 ? (
                            <div className="space-y-1.5">
                              {sols.map((sol) => {
                                const tcfg = solutionTypeConfig[sol.type];
                                const Icon = tcfg?.icon || Wrench;
                                return (
                                  <div
                                    key={sol.id}
                                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left ${urgencyConfig[urg].border} ${urgencyConfig[urg].bg}`}
                                  >
                                    <Icon
                                      className={`h-3.5 w-3.5 shrink-0 ${tcfg?.color || "text-nx-text-muted"}`}
                                    />
                                    <div>
                                      <p className="text-xs font-medium text-nx-text">
                                        {tcfg?.label || sol.type}
                                      </p>
                                      <p className="text-[10px] text-nx-accent">
                                        ROI: {sol.roi_months.toFixed(0)} meses |{" "}
                                        {formatCurrency(sol.monthly_savings)}/mes
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-nx-text-muted">—</span>
                          )}
                        </td>
                      );
                    }
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ROI comparison chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-1">
            Inversion vs Ahorro anual
          </h3>
          <p className="text-xs text-nx-text-muted mb-4">Por tipo de solucion</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={roiData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}k`
                }
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={140}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name) => [
                  formatCurrency(Number(v)),
                  name === "investment" ? "Inversion" : "Ahorro anual",
                ]}
              />
              <Bar
                dataKey="investment"
                fill="#EF4444"
                radius={[0, 4, 4, 0]}
                name="investment"
                barSize={12}
              />
              <Bar
                dataKey="annual_savings"
                fill="#10B981"
                radius={[0, 4, 4, 0]}
                name="annual_savings"
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-nx-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
              Inversion
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              Ahorro anual
            </span>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-1">
            Tiempo de retorno (ROI)
          </h3>
          <p className="text-xs text-nx-text-muted mb-4">
            Meses para recuperar inversion — coloreado por urgencia
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={roiData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                unit=" m"
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={140}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${Number(v).toFixed(1)} meses`, "ROI"]}
              />
              <Bar dataKey="roi_months" radius={[0, 4, 4, 0]} barSize={18}>
                {roiData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.urgency === "immediate"
                        ? "#EF4444"
                        : entry.urgency === "short_term"
                          ? "#F59E0B"
                          : "#0EA5E9"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-nx-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
              Inmediata
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              Corto plazo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0EA5E9]" />
              Mediano plazo
            </span>
          </div>
        </Card>
      </div>

      {/* Detailed solution cards by category */}
      <div>
        <h3 className="text-lg font-semibold text-nx-text mb-1">
          Detalle por tipo de solucion
        </h3>
        <p className="text-xs text-nx-text-muted mb-6">
          Cada solucion con su analisis de impacto, ROI y anomalias que resuelve
        </p>

        <div className="space-y-4">
          {sortedSolutions.map((sol) => {
            const isOpen = expandedId === sol.id;
            const tcfg = solutionTypeConfig[sol.type];
            const ucfg = urgencyConfig[sol.urgency];
            const icfg = impactConfig[sol.impact];
            const Icon = tcfg?.icon || Wrench;

            // Linked anomalies
            const linkedAnomalies = client.anomalies.filter((a) =>
              sol.anomaly_ids.includes(a.id)
            );
            const linkedImpact = linkedAnomalies.reduce(
              (s, a) => s + a.financial_impact_monthly,
              0
            );

            // ROI visual
            const roiYears = sol.roi_months / 12;
            const savingsYear1 = Math.min(sol.annual_savings, sol.annual_savings);
            const netYear1 = savingsYear1 - sol.investment;
            const cumulative5yr = sol.annual_savings * 5 - sol.investment;

            return (
              <Card key={sol.id} className={`!p-0 overflow-hidden ${ucfg.border}`}>
                {/* Header — always visible */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : sol.id)}
                  className="w-full p-5 text-left hover:bg-nx-surface/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`rounded-xl p-3 ${tcfg?.bg || "bg-nx-surface"}`}>
                      <Icon className={`h-6 w-6 ${tcfg?.color || "text-nx-text-muted"}`} />
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-base font-semibold text-nx-text">{sol.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant={ucfg.variant}>
                          {ucfg.label}
                        </Badge>
                        <Badge variant={icfg.variant}>{icfg.label}</Badge>
                        <Badge>{tcfg?.label || sol.type}</Badge>
                      </div>
                      <p className="text-xs text-nx-text-secondary">
                        {tcfg?.description || ""}
                      </p>
                    </div>

                    {/* Right side KPIs */}
                    <div className="shrink-0 text-right hidden md:block">
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
                            Inversion
                          </p>
                          <p className="text-sm font-semibold text-nx-text mt-0.5">
                            {formatCurrency(sol.investment)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
                            Ahorro/mes
                          </p>
                          <p className="text-sm font-semibold text-nx-accent mt-0.5">
                            {formatCurrency(sol.monthly_savings)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
                            ROI
                          </p>
                          <p className="text-sm font-semibold text-nx-primary mt-0.5">
                            {sol.roi_months.toFixed(1)} meses
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-nx-text-muted" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-nx-text-muted" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-nx-border">
                    {/* Description */}
                    <div className="px-5 pt-4 pb-2">
                      <p className="text-sm text-nx-text-secondary leading-relaxed">
                        {sol.description}
                      </p>
                    </div>

                    {/* Metrics grid */}
                    <div className="px-5 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                        <div className="rounded-lg bg-nx-surface p-3">
                          <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
                            Inversion
                          </p>
                          <p className="text-sm font-bold text-nx-text mt-1">
                            {formatCurrency(sol.investment)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-nx-surface p-3">
                          <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
                            Ahorro mensual
                          </p>
                          <p className="text-sm font-bold text-nx-accent mt-1">
                            {formatCurrency(sol.monthly_savings)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-nx-surface p-3">
                          <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
                            Ahorro anual
                          </p>
                          <p className="text-sm font-bold text-nx-accent mt-1">
                            {formatCurrency(sol.annual_savings)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-nx-surface p-3">
                          <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
                            Retorno
                          </p>
                          <p className="text-sm font-bold text-nx-primary mt-1">
                            {sol.roi_months.toFixed(1)} meses
                          </p>
                        </div>
                        <div className="rounded-lg bg-nx-surface p-3">
                          <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
                            Payback
                          </p>
                          <p className="text-sm font-bold text-nx-text mt-1">
                            {sol.payback_date}
                          </p>
                        </div>
                        <div className="rounded-lg bg-nx-surface p-3">
                          <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
                            Ahorro 5 años
                          </p>
                          <p className="text-sm font-bold text-nx-accent mt-1">
                            {formatCurrency(cumulative5yr)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-nx-surface p-3">
                          <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
                            CO2 evitado
                          </p>
                          <p className="text-sm font-bold text-nx-accent mt-1">
                            {sol.co2_reduction_tons} ton/año
                          </p>
                        </div>
                        <div className="rounded-lg bg-nx-surface p-3">
                          <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
                            Estado
                          </p>
                          <Badge variant="primary" className="mt-1">
                            Propuesta
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* ROI projection bar */}
                    <div className="px-5 pb-4">
                      <p className="text-xs text-nx-text-muted mb-2">
                        Proyeccion de recuperacion
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-3 rounded-full bg-nx-surface overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-nx-danger via-nx-warning to-nx-accent transition-all"
                            style={{
                              width: `${Math.min(100, (12 / sol.roi_months) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-nx-text-muted shrink-0">
                          {sol.roi_months < 12
                            ? "Recuperado en < 1 año"
                            : sol.roi_months < 24
                              ? "Recuperado en 1-2 años"
                              : sol.roi_months < 60
                                ? `Recuperado en ${roiYears.toFixed(1)} años`
                                : `Recuperado en ${roiYears.toFixed(0)} años`}
                        </span>
                      </div>
                    </div>

                    {/* Linked anomalies */}
                    {linkedAnomalies.length > 0 && (
                      <div className="px-5 pb-5 border-t border-nx-border pt-4">
                        <p className="text-xs font-medium text-nx-text mb-3">
                          Anomalias que resuelve esta solucion
                        </p>
                        <div className="space-y-2">
                          {linkedAnomalies.map((a) => {
                            const acfg = severityConfig[a.severity];
                            return (
                              <div
                                key={a.id}
                                className="flex items-center justify-between rounded-lg border border-nx-border bg-nx-surface/50 px-3 py-2"
                              >
                                <div className="flex items-center gap-2">
                                  <AlertCircle
                                    className={`h-3.5 w-3.5 ${acfg.color}`}
                                  />
                                  <span className="text-xs text-nx-text">{a.title}</span>
                                  <Badge variant={acfg.variant}>{acfg.label}</Badge>
                                </div>
                                <span className="text-xs text-nx-danger font-medium">
                                  {formatCurrency(a.financial_impact_monthly)}/mes
                                </span>
                              </div>
                            );
                          })}
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="text-nx-text-muted">
                              Total de perdidas que se eliminan
                            </span>
                            <span className="text-nx-accent font-semibold">
                              {formatCurrency(linkedImpact)}/mes
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom executive summary */}
      <Card className="border-nx-accent/30">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-nx-accent" />
          <h3 className="text-sm font-medium text-nx-text">Resumen ejecutivo</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="rounded-lg bg-nx-surface p-3 text-center">
            <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
              Soluciones
            </p>
            <p className="text-lg font-bold text-nx-text mt-1">
              {sortedSolutions.length}
            </p>
          </div>
          <div className="rounded-lg bg-nx-surface p-3 text-center">
            <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
              Inversion total
            </p>
            <p className="text-lg font-bold text-nx-text mt-1">
              {formatCurrency(totalInvestment)}
            </p>
          </div>
          <div className="rounded-lg bg-nx-surface p-3 text-center">
            <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
              Ahorro anual
            </p>
            <p className="text-lg font-bold text-nx-accent mt-1">
              {formatCurrency(totalPotentialSavings)}
            </p>
          </div>
          <div className="rounded-lg bg-nx-surface p-3 text-center">
            <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
              Ahorro 5 años
            </p>
            <p className="text-lg font-bold text-nx-accent mt-1">
              {formatCurrency(totalPotentialSavings * 5 - totalInvestment)}
            </p>
          </div>
          <div className="rounded-lg bg-nx-surface p-3 text-center">
            <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
              ROI promedio
            </p>
            <p className="text-lg font-bold text-nx-primary mt-1">
              {(
                sortedSolutions.reduce((s, sol) => s + sol.roi_months, 0) /
                sortedSolutions.length
              ).toFixed(0)}{" "}
              meses
            </p>
          </div>
          <div className="rounded-lg bg-nx-surface p-3 text-center">
            <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">
              CO2 evitado
            </p>
            <p className="text-lg font-bold text-nx-accent mt-1">{totalCO2} ton/año</p>
          </div>
        </div>

        {/* Recommendation text */}
        <div className="mt-4 rounded-lg bg-nx-accent-bg border border-nx-accent/20 p-4">
          <p className="text-xs text-nx-accent font-semibold mb-1">
            Recomendacion prioritaria
          </p>
          <p className="text-xs text-nx-text-secondary leading-relaxed">
            Iniciar con las <strong className="text-nx-text">3 acciones inmediatas</strong>{" "}
            (banco de capacitores, filtros armonicos, rebalanceo de cargas) que requieren{" "}
            <strong className="text-nx-text">
              {formatCurrency(
                byUrgency.immediate.reduce((s, sol) => s + sol.investment, 0)
              )}
            </strong>{" "}
            de inversion y generan{" "}
            <strong className="text-nx-accent">
              {formatCurrency(
                byUrgency.immediate.reduce((s, sol) => s + sol.annual_savings, 0)
              )}
              /año
            </strong>{" "}
            de ahorro. Estas soluciones eliminan penalizaciones CFE de forma inmediata y
            tienen el ROI mas rapido (14-29 meses). Posteriormente, implementar el retrofit
            LED y evaluar la viabilidad del sistema solar FV y BESS.
          </p>
        </div>
      </Card>
    </div>
  );
}
