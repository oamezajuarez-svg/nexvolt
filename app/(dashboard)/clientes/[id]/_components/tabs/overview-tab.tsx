"use client";

import { Card, CardTitle, CardValue } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrency } from "@/lib/utils";
import { costBreakdown } from "@/lib/mock-client-detail";
import { mockPlantProfile } from "@/lib/mock-plant-profile";
import { mockEquipment } from "@/lib/mock-equipment";
import {
  Zap,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Gauge,
  AlertCircle,
  Wrench,
  Shield,
  Leaf,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SolutionUrgency, ClientDetail } from "@/lib/types";
import {
  calculateAuditProgress,
  calculateCertificationReadiness,
  calculateEnvironmentalImpact,
} from "@/lib/calculations/benefits";
import { useClientData } from "../shared/client-data-context";
import { useComputedData } from "../shared/use-computed";
import {
  severityConfig,
  urgencyConfig,
  solutionTypeConfig,
  tooltipStyle,
} from "../shared/config";

const stepStatusColor: Record<string, string> = {
  complete: "bg-nx-accent border-nx-accent",
  partial: "bg-nx-warning border-nx-warning",
  pending: "bg-nx-surface border-nx-border",
};

const stepTextColor: Record<string, string> = {
  complete: "text-nx-accent",
  partial: "text-nx-warning",
  pending: "text-nx-text-muted",
};

export function OverviewSection() {
  const { client } = useClientData();
  const {
    totalAnnualCost,
    avgMonthly,
    avgPF,
    totalPFPenalty,
    totalAnomalyImpact,
    totalPotentialSavings,
    maxDemand,
    demandExceedCount,
    sortedSolutions,
  } = useComputedData();

  // Build full client detail for calculations
  const fullClient: ClientDetail = {
    ...client,
    plant_profile: mockPlantProfile,
    equipment: mockEquipment,
  };

  const auditProgress = calculateAuditProgress(fullClient);
  const certReadiness = calculateCertificationReadiness(fullClient);
  const envImpact = calculateEnvironmentalImpact(client.invoices, client.proposed_solutions);

  return (
    <div className="space-y-6">
      {/* Audit progress stepper */}
      <Card>
        <h3 className="text-sm font-medium text-nx-text mb-1">Progreso de auditoría</h3>
        <p className="text-xs text-nx-text-muted mb-4">
          Estado del diagnóstico energético — {auditProgress.overall_pct}% completado
        </p>
        <div className="flex items-center justify-between gap-2 mb-4">
          {auditProgress.steps.map((step, i) => (
            <div key={step.id} className="flex flex-col items-center flex-1 min-w-0">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      auditProgress.steps[i - 1].status === "complete"
                        ? "bg-nx-accent"
                        : "bg-nx-border"
                    }`}
                  />
                )}
                <div
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${stepStatusColor[step.status]}`}
                >
                  {step.status === "complete" && (
                    <span className="text-[10px] text-white font-bold">&#10003;</span>
                  )}
                  {step.status === "partial" && (
                    <span className="text-[10px] text-white font-bold">&#8230;</span>
                  )}
                </div>
                {i < auditProgress.steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      step.status === "complete" ? "bg-nx-accent" : "bg-nx-border"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[10px] mt-1.5 text-center leading-tight ${stepTextColor[step.status]}`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <ProgressBar
          value={auditProgress.overall_pct}
          size="sm"
          color={
            auditProgress.overall_pct >= 80
              ? "accent"
              : auditProgress.overall_pct >= 40
              ? "primary"
              : "warning"
          }
        />
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>Costo anual</CardTitle>
              <CardValue className="text-xl">{formatCurrency(totalAnnualCost)}</CardValue>
            </div>
            <div className="rounded-lg p-2 bg-nx-danger-bg">
              <DollarSign className="h-4 w-4 text-nx-danger" />
            </div>
          </div>
          <p className="text-xs text-nx-text-muted mt-2">
            Prom. {formatCurrency(avgMonthly)}/mes
          </p>
          <p className="text-[10px] text-nx-text-muted mt-1 border-t border-nx-border/50 pt-1">
            Suma de {client.invoices.length} recibos CFE
          </p>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>FP promedio</CardTitle>
              <CardValue className="text-xl">{avgPF.toFixed(2)}</CardValue>
            </div>
            <div className="rounded-lg p-2 bg-nx-warning-bg">
              <Gauge className="h-4 w-4 text-nx-warning" />
            </div>
          </div>
          <p className="text-xs text-nx-danger mt-2">
            Penalizacion: {formatCurrency(totalPFPenalty)}/año
          </p>
          <p className="text-[10px] text-nx-text-muted mt-1 border-t border-nx-border/50 pt-1">
            Promedio de FP en {client.invoices.length} recibos
          </p>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>Demanda max</CardTitle>
              <CardValue className="text-xl">{maxDemand} kW</CardValue>
            </div>
            <div className="rounded-lg p-2 bg-nx-primary-bg">
              <Zap className="h-4 w-4 text-nx-primary" />
            </div>
          </div>
          <p className="text-xs text-nx-warning mt-2">
            Excede contrato {demandExceedCount}/12 meses
          </p>
          <p className="text-[10px] text-nx-text-muted mt-1 border-t border-nx-border/50 pt-1">
            Pico max de {client.invoices.length} recibos vs {client.contracted_demand_kw} kW contratados
          </p>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>Perdidas detectadas</CardTitle>
              <CardValue className="text-xl">
                {formatCurrency(totalAnomalyImpact)}
                <span className="text-sm font-normal text-nx-text-muted">/mes</span>
              </CardValue>
            </div>
            <div className="rounded-lg p-2 bg-nx-danger-bg">
              <AlertTriangle className="h-4 w-4 text-nx-danger" />
            </div>
          </div>
          <p className="text-xs text-nx-text-muted mt-2">
            {client.anomalies.filter((a) => a.status === "active").length} anomalias activas
          </p>
          <p className="text-[10px] text-nx-text-muted mt-1 border-t border-nx-border/50 pt-1">
            Suma de impacto de {client.anomalies.filter((a) => a.source === "cfe").length} anomalias CFE + {client.anomalies.filter((a) => a.source === "monitoring").length} de monitoreo
          </p>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>Ahorro potencial</CardTitle>
              <CardValue className="text-xl text-nx-accent">
                {formatCurrency(totalPotentialSavings)}
                <span className="text-sm font-normal text-nx-text-muted">/año</span>
              </CardValue>
            </div>
            <div className="rounded-lg p-2 bg-nx-accent-bg">
              <TrendingDown className="h-4 w-4 text-nx-accent" />
            </div>
          </div>
          <p className="text-xs text-nx-accent mt-2">
            {client.proposed_solutions.length} soluciones propuestas
          </p>
          <p className="text-[10px] text-nx-text-muted mt-1 border-t border-nx-border/50 pt-1">
            Suma de ahorros anuales de {client.proposed_solutions.length} soluciones
          </p>
        </Card>
      </div>

      {/* Quick charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cost trend */}
        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-1">Tendencia de costo mensual</h3>
          <p className="text-xs text-nx-text-muted mb-4">Ultimos 12 meses — total facturado</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={costBreakdown}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={{ stroke: "#1F2937" }}
                tickLine={false}
                tickFormatter={(v: string) => v.slice(0, 3)}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [formatCurrency(Number(v)), "Total"]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#costGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick anomaly + solutions summary */}
        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-4">Diagnostico rapido</h3>
          <div className="space-y-3">
            {/* Top 3 anomalies */}
            {client.anomalies
              .filter((a) => a.status === "active")
              .sort((a, b) => b.financial_impact_monthly - a.financial_impact_monthly)
              .slice(0, 4)
              .map((a) => {
                const cfg = severityConfig[a.severity];
                return (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 rounded-lg border border-nx-border bg-nx-surface/50 p-3"
                  >
                    <AlertCircle className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-nx-text truncate">{a.title}</p>
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-nx-danger mt-0.5">
                        {formatCurrency(a.financial_impact_monthly)}/mes
                      </p>
                    </div>
                  </div>
                );
              })}
            {/* Impact total */}
            <div className="flex items-center justify-between rounded-lg bg-nx-danger-bg p-3 border border-nx-danger/20">
              <span className="text-xs font-medium text-nx-danger">
                Total perdidas mensuales
              </span>
              <span className="text-sm font-bold text-nx-danger">
                {formatCurrency(totalAnomalyImpact)}/mes
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Solutions preview by urgency */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-nx-text">
              Soluciones recomendadas por urgencia
            </h3>
            <p className="text-xs text-nx-text-muted mt-0.5">
              Vista rapida — ve a la pestaña Soluciones y ROI para detalle completo
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["immediate", "short_term", "medium_term"] as SolutionUrgency[]).map((urg) => {
            const ucfg = urgencyConfig[urg];
            const sols = sortedSolutions.filter((s) => s.urgency === urg);
            const totalInv = sols.reduce((s, sol) => s + sol.investment, 0);
            const totalSav = sols.reduce((s, sol) => s + sol.annual_savings, 0);
            return (
              <div
                key={urg}
                className={`rounded-xl border p-4 ${ucfg.border} ${ucfg.bg}`}
              >
                <p className={`text-xs font-semibold ${ucfg.color} mb-3`}>{ucfg.label}</p>
                <div className="space-y-2 mb-3">
                  {sols.map((sol) => {
                    const tcfg = solutionTypeConfig[sol.type];
                    const Icon = tcfg?.icon || Wrench;
                    return (
                      <div key={sol.id} className="flex items-center gap-2 text-xs">
                        <Icon className={`h-3.5 w-3.5 shrink-0 ${tcfg?.color || "text-nx-text-muted"}`} />
                        <span className="text-nx-text truncate">{sol.name}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-nx-border/50 pt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-nx-text-muted">Inversion</span>
                    <span className="text-nx-text font-medium">{formatCurrency(totalInv)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-nx-text-muted">Ahorro/año</span>
                    <span className="text-nx-accent font-medium">{formatCurrency(totalSav)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Teaser cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-nx-accent/20">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>Ahorro potencial</CardTitle>
              <CardValue className="text-xl text-nx-accent">
                {formatCurrency(totalPotentialSavings)}
                <span className="text-sm font-normal text-nx-text-muted">/año</span>
              </CardValue>
            </div>
            <div className="rounded-lg p-2 bg-nx-accent-bg">
              <TrendingDown className="h-4 w-4 text-nx-accent" />
            </div>
          </div>
          <p className="text-xs text-nx-text-muted mt-2">
            Suma de {client.proposed_solutions.length} soluciones propuestas
          </p>
        </Card>

        <Card className="border-nx-primary/20">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>Diagnóstico CONUEE</CardTitle>
              <CardValue className="text-xl text-nx-primary">
                {certReadiness.conuee_pct}%
              </CardValue>
            </div>
            <div className="rounded-lg p-2 bg-nx-primary-bg">
              <Shield className="h-4 w-4 text-nx-primary" />
            </div>
          </div>
          <p className="text-xs text-nx-text-muted mt-2">
            Preparación para diagnóstico oficial
          </p>
        </Card>

        <Card className="border-nx-accent/20">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle>Reducción CO2</CardTitle>
              <CardValue className="text-xl text-nx-accent">
                {envImpact.reduction_potential_tons}
                <span className="text-sm font-normal text-nx-text-muted"> ton/año</span>
              </CardValue>
            </div>
            <div className="rounded-lg p-2 bg-nx-accent-bg">
              <Leaf className="h-4 w-4 text-nx-accent" />
            </div>
          </div>
          <p className="text-xs text-nx-text-muted mt-2">
            Equivale a {envImpact.tree_equivalents} árboles plantados
          </p>
        </Card>
      </div>
    </div>
  );
}
