"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardTitle, CardValue } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { mockClientDetail, mockLive24h, costBreakdown } from "@/lib/mock-client-detail";
import {
  ArrowLeft,
  Zap,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Gauge,
  FileText,
  Radio,
  Shield,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  CircleDot,
  AlertCircle,
  Info,
  CheckCircle2,
  Wrench,
  Sun,
  Battery,
  Cable,
  Waves,
  LampDesk,
  ArrowRight,
  Clock,
  Target,
  BarChart3,
  Flame,
  Leaf,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  ReferenceLine,
  PieChart,
  Pie,
} from "recharts";
import type {
  AnomalySeverity,
  AnomalySource,
  SolutionUrgency,
  SolutionImpact,
  SolutionType,
} from "@/lib/types";

// ─── Constants ───

const client = mockClientDetail;

const severityConfig: Record<
  AnomalySeverity,
  { label: string; variant: "danger" | "warning" | "primary" | "default"; color: string }
> = {
  critical: { label: "Critico", variant: "danger", color: "text-nx-danger" },
  high: { label: "Alto", variant: "warning", color: "text-nx-warning" },
  medium: { label: "Medio", variant: "primary", color: "text-nx-primary" },
  low: { label: "Bajo", variant: "default", color: "text-nx-text-muted" },
};

const urgencyConfig: Record<SolutionUrgency, { label: string; color: string; bg: string; border: string; variant: "danger" | "warning" | "primary" }> = {
  immediate: { label: "Accion inmediata", color: "text-nx-danger", bg: "bg-nx-danger-bg", border: "border-nx-danger/30", variant: "danger" },
  short_term: { label: "Corto plazo (1-6 meses)", color: "text-nx-warning", bg: "bg-nx-warning-bg", border: "border-nx-warning/30", variant: "warning" },
  medium_term: { label: "Mediano plazo (6-18 meses)", color: "text-nx-primary", bg: "bg-nx-primary-bg", border: "border-nx-primary/30", variant: "primary" },
};

const impactConfig: Record<SolutionImpact, { label: string; variant: "accent" | "primary" | "default" }> = {
  high: { label: "Impacto alto", variant: "accent" },
  medium: { label: "Impacto medio", variant: "primary" },
  low: { label: "Impacto bajo", variant: "default" },
};

const solutionTypeConfig: Record<
  string,
  { label: string; icon: typeof Sun; color: string; bg: string; description: string }
> = {
  solar_pv: {
    label: "Paneles Solares (FV)",
    icon: Sun,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    description: "Generacion fotovoltaica en techo o terreno para reducir compra de energia a CFE",
  },
  bess: {
    label: "Almacenamiento (BESS)",
    icon: Battery,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    description: "Baterias para peak shaving, desplazamiento de carga y respaldo",
  },
  capacitor_bank: {
    label: "Banco de Capacitores",
    icon: Cable,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    description: "Correccion de factor de potencia para eliminar penalizaciones CFE",
  },
  vfd: {
    label: "VFD / Filtros Armonicos",
    icon: Waves,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    description: "Variadores de frecuencia y filtros para calidad de energia",
  },
  led: {
    label: "Retrofit LED",
    icon: LampDesk,
    color: "text-yellow-300",
    bg: "bg-yellow-300/10",
    description: "Sustitucion de iluminacion por LED con controles inteligentes",
  },
  mem_migration: {
    label: "Migracion MEM",
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    description: "Cambio al Mercado Electrico Mayorista para mejores tarifas",
  },
};

// ─── Computed data ───

const totalAnnualCost = client.invoices.reduce((sum, inv) => sum + inv.total_cost, 0);
const avgMonthly = totalAnnualCost / 12;
const avgPF =
  client.invoices.reduce((sum, inv) => sum + inv.power_factor, 0) / client.invoices.length;
const totalPFPenalty = client.invoices.reduce((sum, inv) => sum + inv.cost_power_factor, 0);
const totalAnomalyImpact = client.anomalies
  .filter((a) => a.status === "active")
  .reduce((sum, a) => sum + a.financial_impact_monthly, 0);
const totalPotentialSavings = client.proposed_solutions.reduce(
  (sum, s) => sum + s.annual_savings,
  0
);
const maxDemand = Math.max(...client.invoices.map((i) => i.demand_max_kw));
const demandExceedCount = client.invoices.filter(
  (i) => i.demand_max_kw > client.contracted_demand_kw
).length;

const consumptionBreakdown = client.invoices.map((inv) => ({
  period: inv.period.slice(0, 3),
  base: inv.consumption_base_kwh,
  intermedia: inv.consumption_intermedia_kwh,
  punta: inv.consumption_punta_kwh,
}));

const demandData = client.invoices.map((inv) => ({
  period: inv.period.slice(0, 3),
  max: inv.demand_max_kw,
  contracted: client.contracted_demand_kw,
}));

const pfData = client.invoices.map((inv) => ({
  period: inv.period.slice(0, 3),
  pf: inv.power_factor,
  penalty: inv.power_factor_penalty_pct,
}));

const tooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #1F2937",
  borderRadius: "8px",
  color: "#F9FAFB",
  fontSize: 13,
};

// Solution grouping
const urgencyOrder: Record<SolutionUrgency, number> = {
  immediate: 0,
  short_term: 1,
  medium_term: 2,
};
const sortedSolutions = [...client.proposed_solutions].sort(
  (a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency] || a.roi_months - b.roi_months
);
const totalInvestment = client.proposed_solutions.reduce((s, sol) => s + sol.investment, 0);
const totalMonthlySavings = client.proposed_solutions.reduce(
  (s, sol) => s + sol.monthly_savings,
  0
);
const totalCO2 = client.proposed_solutions.reduce((s, sol) => s + sol.co2_reduction_tons, 0);

// ─── Tabs ───

const sections = [
  { id: "overview", label: "Resumen" },
  { id: "cfe", label: "Recibos CFE" },
  { id: "monitoring", label: "Monitoreo" },
  { id: "anomalies", label: "Anomalias" },
  { id: "solutions", label: "Soluciones y ROI" },
  { id: "simulator", label: "Simulador de ahorro" },
] as const;
type SectionId = (typeof sections)[number]["id"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATA SOURCES — transparency bar
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function DataSourcesSummary() {
  const invoiceCount = client.invoices.length;
  const firstPeriod = client.invoices[0]?.period || "—";
  const lastPeriod = client.invoices[invoiceCount - 1]?.period || "—";
  const deviceCount = client.monitoring_devices.length;
  const onlineDevices = client.monitoring_devices.filter((d) => d.status === "online").length;
  const anomalyCount = client.anomalies.length;
  const activeAnomalies = client.anomalies.filter((a) => a.status === "active").length;
  const cfeAnomalies = client.anomalies.filter((a) => a.source === "cfe").length;
  const monAnomalies = client.anomalies.filter((a) => a.source === "monitoring").length;
  const solutionCount = client.proposed_solutions.length;

  const coverageMonths = invoiceCount;
  const coveragePct = Math.round((coverageMonths / 12) * 100);

  return (
    <Card className="!p-0 overflow-hidden">
      <div className="px-5 py-3 border-b border-nx-border bg-nx-surface/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-nx-primary" />
          <h3 className="text-sm font-medium text-nx-text">Base de datos del analisis</h3>
        </div>
        <Badge variant={coveragePct >= 100 ? "accent" : coveragePct >= 50 ? "warning" : "danger"}>
          Cobertura: {coveragePct}%
        </Badge>
      </div>

      <div className="px-5 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-nx-primary" />
              <p className="text-xs font-semibold text-nx-text">Recibos CFE cargados</p>
            </div>
            <p className="text-2xl font-bold text-nx-primary">{invoiceCount}</p>
            <p className="text-[11px] text-nx-text-secondary mt-1">
              Periodo: {firstPeriod} — {lastPeriod}
            </p>
            <p className="text-[11px] text-nx-text-muted mt-0.5">
              {coverageMonths === 12
                ? "Cobertura completa (12 meses)"
                : `Faltan ${12 - coverageMonths} meses para cobertura completa`}
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-nx-surface overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${coveragePct >= 100 ? "bg-nx-accent" : "bg-nx-warning"}`}
                style={{ width: `${Math.min(100, coveragePct)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Radio className="h-4 w-4 text-nx-accent" />
              <p className="text-xs font-semibold text-nx-text">Monitoreo en vivo</p>
            </div>
            <p className="text-2xl font-bold text-nx-accent">{deviceCount}</p>
            <p className="text-[11px] text-nx-text-secondary mt-1">
              {onlineDevices}/{deviceCount} dispositivos en linea
            </p>
            <p className="text-[11px] text-nx-text-muted mt-0.5">
              {deviceCount > 0
                ? `Modelos: ${[...new Set(client.monitoring_devices.map((d) => d.model))].join(", ")}`
                : "Sin dispositivos instalados"}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-nx-warning" />
              <p className="text-xs font-semibold text-nx-text">Anomalias detectadas</p>
            </div>
            <p className="text-2xl font-bold text-nx-warning">{anomalyCount}</p>
            <p className="text-[11px] text-nx-text-secondary mt-1">
              {activeAnomalies} activas | {anomalyCount - activeAnomalies} resueltas/reconocidas
            </p>
            <p className="text-[11px] text-nx-text-muted mt-0.5">
              {cfeAnomalies} de recibos CFE, {monAnomalies} de monitoreo
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <p className="text-xs font-semibold text-nx-text">Soluciones propuestas</p>
            </div>
            <p className="text-2xl font-bold text-amber-400">{solutionCount}</p>
            <p className="text-[11px] text-nx-text-secondary mt-1">
              {client.proposed_solutions.filter((s) => s.urgency === "immediate").length} inmediatas,{" "}
              {client.proposed_solutions.filter((s) => s.urgency === "short_term").length} corto plazo,{" "}
              {client.proposed_solutions.filter((s) => s.urgency === "medium_term").length} mediano plazo
            </p>
            <p className="text-[11px] text-nx-text-muted mt-0.5">
              Basadas en {anomalyCount} anomalias y {invoiceCount} recibos
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-nx-surface/50 border border-nx-border px-4 py-3">
          <p className="text-[11px] text-nx-text-muted leading-relaxed">
            <strong className="text-nx-text-secondary">Como se calcula:</strong>{" "}
            Todos los indicadores se derivan exclusivamente de los <strong>{invoiceCount} recibos CFE</strong> cargados
            ({firstPeriod} a {lastPeriod}) y las lecturas de los <strong>{deviceCount} dispositivos de monitoreo</strong>.
            El costo anual es la suma directa de los {invoiceCount} recibos.
            El FP promedio es el promedio aritmetico de los {invoiceCount} factores de potencia facturados.
            Las penalizaciones se extraen del campo &quot;cargo por factor de potencia&quot; de cada recibo.
            Las anomalias se detectan comparando valores contra umbrales normativos (FP &lt; 0.90, demanda &gt; contratada, THD &gt; IEEE 519).
            Las soluciones y su ROI se calculan con precios de mercado actualizados y los ahorros estimados para cada anomalia que resuelven.
            <strong> Entre mas recibos se carguen, mas preciso sera el analisis.</strong>
          </p>
        </div>
      </div>
    </Card>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ClientDetailPage() {
  const [section, setSection] = useState<SectionId>("overview");
  const [selectedSols, setSelectedSols] = useState<Set<string>>(new Set());

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/clientes"
          className="inline-flex items-center gap-1.5 text-sm text-nx-text-muted hover:text-nx-text transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a clientes
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-nx-text tracking-tight">
              {client.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-nx-text-secondary">
              <span>{client.industry}</span>
              <span className="text-nx-border">|</span>
              <span>{client.location}</span>
              <span className="text-nx-border">|</span>
              <span className="font-mono text-xs text-nx-text-muted">{client.rfc}</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <Badge variant="accent">Activo</Badge>
            <p className="text-xs text-nx-text-muted">Tarifa {client.tariff}</p>
            <p className="text-xs text-nx-text-muted">{client.rpu}</p>
          </div>
        </div>
      </div>

      {/* Client info bar */}
      <Card className="!p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
          <div>
            <p className="text-xs text-nx-text-muted">Contacto</p>
            <p className="text-nx-text font-medium mt-0.5">{client.contact_name}</p>
          </div>
          <div>
            <p className="text-xs text-nx-text-muted">Email</p>
            <p className="text-nx-primary mt-0.5 text-xs">{client.contact_email}</p>
          </div>
          <div>
            <p className="text-xs text-nx-text-muted">Telefono</p>
            <p className="text-nx-text-secondary mt-0.5">{client.contact_phone}</p>
          </div>
          <div>
            <p className="text-xs text-nx-text-muted">Demanda contratada</p>
            <p className="text-nx-text font-medium mt-0.5">{client.contracted_demand_kw} kW</p>
          </div>
          <div>
            <p className="text-xs text-nx-text-muted">Tension</p>
            <p className="text-nx-text-secondary mt-0.5">{client.supply_voltage}</p>
          </div>
          <div>
            <p className="text-xs text-nx-text-muted">Medidor</p>
            <p className="text-nx-text-secondary mt-0.5 font-mono text-xs">
              {client.meter_number}
            </p>
          </div>
        </div>
      </Card>

      {/* ── Data Sources Summary ── */}
      <DataSourcesSummary />

      {/* Nav */}
      <div className="flex gap-1 border-b border-nx-border overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              section === s.id
                ? "border-nx-primary text-nx-primary"
                : "border-transparent text-nx-text-muted hover:text-nx-text-secondary"
            }`}
          >
            {s.label}
            {s.id === "anomalies" && (
              <Badge variant="danger" className="ml-2">
                {client.anomalies.filter((a) => a.status === "active").length}
              </Badge>
            )}
            {s.id === "solutions" && (
              <Badge variant="accent" className="ml-2">
                {client.proposed_solutions.length}
              </Badge>
            )}
            {s.id === "simulator" && selectedSols.size > 0 && (
              <Badge variant="accent" className="ml-2">{selectedSols.size}</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {section === "overview" && <OverviewSection />}
      {section === "cfe" && <CFESection />}
      {section === "monitoring" && <MonitoringSection />}
      {section === "anomalies" && <AnomaliesSection />}
      {section === "solutions" && <SolutionsSection />}
      {section === "simulator" && (
        <SimulatorSection selected={selectedSols} setSelected={setSelectedSols} />
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESUMEN — KPIs + vista rapida
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function OverviewSection() {
  return (
    <div className="space-y-6">
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
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RECIBOS CFE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function CFESection() {
  const firstP = client.invoices[0]?.period || "—";
  const lastP = client.invoices[client.invoices.length - 1]?.period || "—";

  return (
    <div className="space-y-6">
      {/* Section header with data source */}
      <div className="flex items-center justify-between rounded-lg bg-nx-surface/50 border border-nx-border px-4 py-3">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-nx-primary" />
          <div>
            <p className="text-sm font-medium text-nx-text">
              Analisis basado en {client.invoices.length} recibos CFE
            </p>
            <p className="text-[11px] text-nx-text-muted">
              Periodo cubierto: {firstP} a {lastP} | Tarifa: {client.tariff} | RPU: {client.rpu}
            </p>
          </div>
        </div>
        <Badge variant={client.invoices.length >= 12 ? "accent" : "warning"}>
          {client.invoices.length}/12 meses
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Consumo por periodo */}
        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-1">
            Consumo por periodo horario
          </h3>
          <p className="text-xs text-nx-text-muted mb-4">
            kWh desglosado — base, intermedia y punta
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={consumptionBreakdown}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={{ stroke: "#1F2937" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name) => {
                  const labels: Record<string, string> = {
                    base: "Base",
                    intermedia: "Intermedia",
                    punta: "Punta",
                  };
                  return [`${Number(v).toLocaleString()} kWh`, labels[String(name)] || String(name)];
                }}
              />
              <Bar dataKey="base" stackId="a" fill="#0EA5E9" name="base" />
              <Bar dataKey="intermedia" stackId="a" fill="#8B5CF6" name="intermedia" />
              <Bar
                dataKey="punta"
                stackId="a"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                name="punta"
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 text-xs text-nx-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0EA5E9]" />
              Base
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
              Intermedia
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
              Punta
            </span>
          </div>
        </Card>

        {/* Composicion de costo */}
        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-1">Composicion del costo</h3>
          <p className="text-xs text-nx-text-muted mb-4">Desglose mensual del recibo CFE</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={costBreakdown}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
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
                formatter={(v, name) => {
                  const labels: Record<string, string> = {
                    energy: "Energia",
                    demand: "Demanda",
                    distribution: "Dist+Trans",
                    power_factor: "Factor potencia",
                    iva: "IVA",
                  };
                  return [formatCurrency(Number(v)), labels[String(name)] || String(name)];
                }}
              />
              <Bar dataKey="energy" stackId="a" fill="#10B981" name="energy" />
              <Bar dataKey="demand" stackId="a" fill="#0EA5E9" name="demand" />
              <Bar dataKey="distribution" stackId="a" fill="#6366F1" name="distribution" />
              <Bar dataKey="power_factor" stackId="a" fill="#EF4444" name="power_factor" />
              <Bar
                dataKey="iva"
                stackId="a"
                fill="#374151"
                radius={[4, 4, 0, 0]}
                name="iva"
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-nx-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              Energia
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0EA5E9]" />
              Demanda
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#6366F1]" />
              Dist+Trans
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
              FP
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#374151]" />
              IVA
            </span>
          </div>
        </Card>
      </div>

      {/* Demanda + FP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-1">
            Demanda maxima vs contratada
          </h3>
          <p className="text-xs text-nx-text-muted mb-4">kW — excedentes en rojo</p>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart
              data={demandData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={{ stroke: "#1F2937" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[200, 400]}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${Number(v)} kW`, "Demanda"]}
              />
              <ReferenceLine
                y={client.contracted_demand_kw}
                stroke="#EF4444"
                strokeDasharray="8 4"
                label={{
                  value: `Contrato: ${client.contracted_demand_kw} kW`,
                  fill: "#EF4444",
                  fontSize: 11,
                  position: "right",
                }}
              />
              <Bar dataKey="max" radius={[4, 4, 0, 0]} name="max">
                {demandData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.max > client.contracted_demand_kw ? "#EF4444" : "#0EA5E9"
                    }
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-1">Factor de potencia</h3>
          <p className="text-xs text-nx-text-muted mb-4">FP y % de penalizacion</p>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart
              data={pfData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={{ stroke: "#1F2937" }}
                tickLine={false}
              />
              <YAxis
                yAxisId="pf"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0.7, 1.0]}
              />
              <YAxis
                yAxisId="penalty"
                orientation="right"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name) =>
                  name === "pf"
                    ? [Number(v).toFixed(2), "Factor potencia"]
                    : [`${Number(v)}%`, "Penalizacion"]
                }
              />
              <ReferenceLine
                yAxisId="pf"
                y={0.9}
                stroke="#10B981"
                strokeDasharray="8 4"
                label={{
                  value: "Meta: 0.90",
                  fill: "#10B981",
                  fontSize: 11,
                  position: "left",
                }}
              />
              <Line
                yAxisId="pf"
                type="monotone"
                dataKey="pf"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 4, fill: "#F59E0B" }}
                name="pf"
              />
              <Bar
                yAxisId="penalty"
                dataKey="penalty"
                fill="rgba(239,68,68,0.3)"
                radius={[4, 4, 0, 0]}
                name="penalty"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Invoice table */}
      <Card>
        <h3 className="text-sm font-medium text-nx-text mb-4">Historial de recibos CFE</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-nx-border text-left text-nx-text-muted">
                <th className="pb-2 font-medium">Periodo</th>
                <th className="pb-2 font-medium text-right">kWh total</th>
                <th className="pb-2 font-medium text-right">Dem. max</th>
                <th className="pb-2 font-medium text-right">FP</th>
                <th className="pb-2 font-medium text-right">Penaliz. FP</th>
                <th className="pb-2 font-medium text-right">Energia</th>
                <th className="pb-2 font-medium text-right">Demanda</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nx-border">
              {client.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-nx-surface/50 transition-colors">
                  <td className="py-2 font-medium text-nx-text">{inv.period}</td>
                  <td className="py-2 text-right text-nx-text-secondary">
                    {formatNumber(inv.total_kwh)}
                  </td>
                  <td
                    className={`py-2 text-right ${
                      inv.demand_max_kw > client.contracted_demand_kw
                        ? "text-nx-danger font-medium"
                        : "text-nx-text-secondary"
                    }`}
                  >
                    {inv.demand_max_kw} kW
                  </td>
                  <td
                    className={`py-2 text-right font-mono ${
                      inv.power_factor < 0.9 ? "text-nx-warning" : "text-nx-accent"
                    }`}
                  >
                    {inv.power_factor.toFixed(2)}
                  </td>
                  <td className="py-2 text-right text-nx-danger">
                    {inv.cost_power_factor > 0 ? `+${inv.power_factor_penalty_pct}%` : "-"}
                  </td>
                  <td className="py-2 text-right text-nx-text-secondary">
                    {formatCurrency(inv.cost_energy)}
                  </td>
                  <td className="py-2 text-right text-nx-text-secondary">
                    {formatCurrency(inv.cost_demand)}
                  </td>
                  <td className="py-2 text-right font-medium text-nx-text">
                    {formatCurrency(inv.total_cost)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-nx-border font-medium">
                <td className="pt-3 text-nx-text">Total anual</td>
                <td className="pt-3 text-right text-nx-text">
                  {formatNumber(client.invoices.reduce((s, i) => s + i.total_kwh, 0))}
                </td>
                <td className="pt-3 text-right text-nx-text">{maxDemand} kW</td>
                <td className="pt-3 text-right text-nx-warning font-mono">
                  {avgPF.toFixed(2)}
                </td>
                <td className="pt-3 text-right text-nx-danger">
                  {formatCurrency(totalPFPenalty)}
                </td>
                <td className="pt-3 text-right text-nx-text">
                  {formatCurrency(
                    client.invoices.reduce((s, i) => s + i.cost_energy, 0)
                  )}
                </td>
                <td className="pt-3 text-right text-nx-text">
                  {formatCurrency(
                    client.invoices.reduce((s, i) => s + i.cost_demand, 0)
                  )}
                </td>
                <td className="pt-3 text-right text-nx-accent">
                  {formatCurrency(totalAnnualCost)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MONITOREO EN VIVO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function MonitoringSection() {
  const devices = client.monitoring_devices;
  const r = devices[0].last_reading;
  const onlineCount = devices.filter((d) => d.status === "online").length;

  return (
    <div className="space-y-6">
      {/* Section header with data source */}
      <div className="flex items-center justify-between rounded-lg bg-nx-surface/50 border border-nx-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Radio className="h-4 w-4 text-nx-accent" />
          <div>
            <p className="text-sm font-medium text-nx-text">
              {devices.length} dispositivos instalados — {onlineCount} en linea
            </p>
            <p className="text-[11px] text-nx-text-muted">
              Ultima lectura: {new Date(r.timestamp).toLocaleString("es-MX")} |
              Modelos: {[...new Set(devices.map((d) => d.model))].join(", ")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <CircleDot className="h-3 w-3 text-nx-accent animate-pulse" />
          <span className="text-xs text-nx-accent font-medium">En vivo</span>
        </div>
      </div>

      {/* Live readings */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Potencia activa", value: `${r.power_kw} kW`, color: "text-nx-primary" },
          { label: "Potencia reactiva", value: `${r.reactive_kvar} kVAR`, color: "text-nx-warning" },
          { label: "Potencia aparente", value: `${r.apparent_kva} kVA`, color: "text-nx-text-secondary" },
          { label: "Factor de potencia", value: r.power_factor.toFixed(3), color: r.power_factor < 0.9 ? "text-nx-danger" : "text-nx-accent" },
          { label: "Frecuencia", value: `${r.frequency_hz} Hz`, color: "text-nx-accent" },
          { label: "THD corriente", value: `${r.thd_i_pct}%`, color: r.thd_i_pct > 20 ? "text-nx-danger" : "text-nx-accent" },
        ].map((item) => (
          <Card key={item.label} className="!p-4">
            <p className="text-xs text-nx-text-muted">{item.label}</p>
            <p className={`text-lg font-semibold mt-1 ${item.color}`}>{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Voltage & Current per phase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-4">Voltaje por fase</h3>
          <div className="space-y-3">
            {(["l1", "l2", "l3"] as const).map((phase, i) => {
              const v = r[`voltage_${phase}` as keyof typeof r] as number;
              const nominal = 220;
              const deviation = ((v - nominal) / nominal) * 100;
              const pct = (v / nominal) * 100;
              return (
                <div key={phase}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-nx-text-secondary">L{i + 1}</span>
                    <span className="text-nx-text font-mono">
                      {v.toFixed(1)}V{" "}
                      <span
                        className={`ml-1 ${Math.abs(deviation) > 3 ? "text-nx-warning" : "text-nx-text-muted"}`}
                      >
                        ({deviation > 0 ? "+" : ""}
                        {deviation.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-nx-surface overflow-hidden">
                    <div
                      className={`h-full rounded-full ${Math.abs(deviation) > 5 ? "bg-nx-danger" : Math.abs(deviation) > 3 ? "bg-nx-warning" : "bg-nx-primary"}`}
                      style={{ width: `${Math.min(100, Math.max(0, pct - 90) * 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-nx-text mb-4">Corriente por fase</h3>
          <div className="space-y-3">
            {(["l1", "l2", "l3"] as const).map((phase, i) => {
              const v = r[`current_${phase}` as keyof typeof r] as number;
              const max = Math.max(r.current_l1, r.current_l2, r.current_l3);
              const pct = (v / max) * 100;
              return (
                <div key={phase}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-nx-text-secondary">L{i + 1}</span>
                    <span className="text-nx-text font-mono">{v.toFixed(1)}A</span>
                  </div>
                  <div className="h-2 rounded-full bg-nx-surface overflow-hidden">
                    <div
                      className={`h-full rounded-full ${i === 1 ? "bg-nx-warning" : "bg-nx-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-nx-warning mt-1">
              Desbalance detectado: L2 carga 49% mas que L1
            </p>
          </div>
        </Card>
      </div>

      {/* 24h profile */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-nx-text">
              Perfil de carga — ultimas 24h
            </h3>
            <p className="text-xs text-nx-text-muted mt-0.5">
              Potencia activa y factor de potencia cada 15 min
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <CircleDot className="h-3 w-3 text-nx-accent animate-pulse" />
            <span className="text-xs text-nx-accent">En vivo</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={mockLive24h}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPower24" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#6B7280", fontSize: 10 }}
              axisLine={{ stroke: "#1F2937" }}
              tickLine={false}
              interval={7}
            />
            <YAxis
              yAxisId="kw"
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="pf"
              orientation="right"
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0.7, 1.0]}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <ReferenceLine
              yAxisId="kw"
              y={client.contracted_demand_kw}
              stroke="#EF4444"
              strokeDasharray="8 4"
            />
            <Area
              yAxisId="kw"
              type="monotone"
              dataKey="power_kw"
              stroke="#0EA5E9"
              strokeWidth={2}
              fill="url(#colorPower24)"
              name="Potencia (kW)"
            />
            <Line
              yAxisId="pf"
              type="monotone"
              dataKey="power_factor"
              stroke="#F59E0B"
              strokeWidth={1.5}
              dot={false}
              name="Factor potencia"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 text-xs text-nx-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#0EA5E9]" />
            Potencia kW
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
            Factor potencia
          </span>
        </div>
      </Card>

      {/* Devices */}
      <Card>
        <h3 className="text-sm font-medium text-nx-text mb-4">Dispositivos de monitoreo</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-nx-border text-left text-nx-text-muted">
                <th className="pb-2 font-medium">Dispositivo</th>
                <th className="pb-2 font-medium">Modelo</th>
                <th className="pb-2 font-medium">Ubicacion</th>
                <th className="pb-2 font-medium text-right">kW</th>
                <th className="pb-2 font-medium text-right">kVAR</th>
                <th className="pb-2 font-medium text-right">FP</th>
                <th className="pb-2 font-medium text-right">THDi</th>
                <th className="pb-2 font-medium text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nx-border">
              {devices.map((dev) => (
                <tr key={dev.id} className="hover:bg-nx-surface/50 transition-colors">
                  <td className="py-2 font-medium text-nx-text">{dev.name}</td>
                  <td className="py-2 text-nx-text-muted font-mono">{dev.model}</td>
                  <td className="py-2 text-nx-text-secondary">{dev.location}</td>
                  <td className="py-2 text-right text-nx-text">
                    {dev.last_reading.power_kw}
                  </td>
                  <td className="py-2 text-right text-nx-text-secondary">
                    {dev.last_reading.reactive_kvar}
                  </td>
                  <td
                    className={`py-2 text-right font-mono ${dev.last_reading.power_factor < 0.9 ? "text-nx-warning" : "text-nx-accent"}`}
                  >
                    {dev.last_reading.power_factor.toFixed(3)}
                  </td>
                  <td
                    className={`py-2 text-right ${dev.last_reading.thd_i_pct > 20 ? "text-nx-danger font-medium" : "text-nx-text-secondary"}`}
                  >
                    {dev.last_reading.thd_i_pct}%
                  </td>
                  <td className="py-2 text-center">
                    <Badge
                      variant={
                        dev.status === "online"
                          ? "accent"
                          : dev.status === "warning"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {dev.status === "online"
                        ? "En linea"
                        : dev.status === "warning"
                          ? "Alerta"
                          : "Fuera de linea"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANOMALIAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AnomaliesSection() {
  const [filter, setFilter] = useState<"all" | AnomalySource>("all");
  const filtered = client.anomalies.filter((a) => filter === "all" || a.source === filter);
  const cfeCount = client.anomalies.filter((a) => a.source === "cfe").length;
  const monCount = client.anomalies.filter((a) => a.source === "monitoring").length;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between rounded-lg bg-nx-surface/50 border border-nx-border px-4 py-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-nx-warning" />
          <div>
            <p className="text-sm font-medium text-nx-text">
              {client.anomalies.length} anomalias detectadas — {client.anomalies.filter((a) => a.status === "active").length} activas
            </p>
            <p className="text-[11px] text-nx-text-muted">
              Detectadas analizando {client.invoices.length} recibos CFE y {client.monitoring_devices.length} dispositivos de monitoreo.
              Criterios: FP &lt; 0.90, demanda &gt; contratada, THDi &gt; 20% (IEEE 519), desbalance &gt; 10%, consumo base anormal.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[
          { id: "all" as const, label: `Todas (${client.anomalies.length})` },
          { id: "cfe" as const, label: `Recibos CFE (${cfeCount})` },
          { id: "monitoring" as const, label: `Monitoreo (${monCount})` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.id
                ? "bg-nx-primary-bg text-nx-primary border border-nx-primary/20"
                : "bg-nx-surface text-nx-text-muted border border-nx-border hover:text-nx-text-secondary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Summary by severity */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {(["critical", "high", "medium", "low"] as AnomalySeverity[]).map((sev) => {
          const count = client.anomalies.filter(
            (a) => a.severity === sev && a.status === "active"
          ).length;
          const impact = client.anomalies
            .filter((a) => a.severity === sev && a.status === "active")
            .reduce((s, a) => s + a.financial_impact_monthly, 0);
          const cfg = severityConfig[sev];
          return (
            <Card key={sev} className="!p-4">
              <div className="flex items-center justify-between">
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
                <span className={`text-xl font-semibold ${cfg.color}`}>{count}</span>
              </div>
              {impact > 0 && (
                <p className="text-xs text-nx-text-muted mt-2">
                  Impacto: {formatCurrency(impact)}/mes
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Anomaly list */}
      <div className="space-y-3">
        {filtered.map((anomaly) => {
          const cfg = severityConfig[anomaly.severity];
          const StatusIcon =
            anomaly.status === "active"
              ? AlertCircle
              : anomaly.status === "acknowledged"
                ? Info
                : CheckCircle2;
          return (
            <Card key={anomaly.id} className="!p-4">
              <div className="flex items-start gap-3">
                <StatusIcon className={`h-5 w-5 mt-0.5 shrink-0 ${cfg.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-medium text-nx-text">{anomaly.title}</h4>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    <Badge variant={anomaly.source === "cfe" ? "primary" : "accent"}>
                      {anomaly.source === "cfe" ? "CFE" : "Monitoreo"}
                    </Badge>
                  </div>
                  <p className="text-xs text-nx-text-secondary mt-1.5 leading-relaxed">
                    {anomaly.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-nx-text-muted">
                    {anomaly.period && <span>Periodo: {anomaly.period}</span>}
                    <span className="text-nx-danger font-medium">
                      Impacto: {formatCurrency(anomaly.financial_impact_monthly)}/mes
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="!p-4 border-nx-danger/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-nx-danger" />
            <span className="text-sm font-medium text-nx-text">
              Impacto financiero total
            </span>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-nx-danger">
              {formatCurrency(totalAnomalyImpact)}/mes
            </p>
            <p className="text-xs text-nx-text-muted">
              {formatCurrency(totalAnomalyImpact * 12)}/año
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SOLUCIONES Y ROI — categorizado por tipo, con detalle completo
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SolutionsSection() {
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

      {/* ── Executive summary ── */}
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

      {/* ── Matriz de prioridad: Urgencia × Impacto ── */}
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

      {/* ── ROI comparison chart ── */}
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

      {/* ── Detailed solution cards by category ── */}
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

      {/* ── Bottom executive summary ── */}
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


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SIMULADOR — selecciona soluciones y ve bajar el recibo
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Effects each solution has on the average invoice
const solEffects: Record<string, {
  pfOverride?: number;
  demandCutKw?: number;
  energyPct?: number; // multiplier, e.g. 0.88 = 12% less
  demandCostPct?: number;
  distPct?: number;
}> = {
  "sol-01": { pfOverride: 0.96 },                          // Capacitores → FP 0.96
  "sol-02": { demandCutKw: 50, energyPct: 0.93 },         // BESS → -50kW pico, -7% energia (punta shift)
  "sol-03": { energyPct: 0.65, distPct: 0.65 },           // Solar → -35% energia y distribución
  "sol-04": { energyPct: 0.97 },                           // Filtros → -3% pérdidas
  "sol-05": { energyPct: 0.88, distPct: 0.88 },           // LED → -12% energia
  "sol-06": { energyPct: 0.98 },                           // Rebalanceo → -2% pérdidas
};

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

function SimulatorSection({
  selected,
  setSelected,
}: {
  selected: Set<string>;
  setSelected: (s: Set<string>) => void;
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
