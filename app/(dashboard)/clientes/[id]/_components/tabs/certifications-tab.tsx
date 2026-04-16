"use client";

import { useMemo } from "react";
import { Card, CardTitle, CardValue } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { SectionHeader } from "@/components/ui/section-header";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { mockEquipment } from "@/lib/mock-equipment";
import { mockPlantProfile } from "@/lib/mock-plant-profile";
import {
  calculateCertificationReadiness,
  calculateFiscalBenefits,
  calculateEnvironmentalImpact,
  calculateFinancialProjection,
} from "@/lib/calculations/benefits";
import { useClientData } from "../shared/client-data-context";
import type { ClientDetail, CertificationItem } from "@/lib/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  ShieldCheck,
  Leaf,
  Award,
  Flame,
  TreePine,
  Car,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  BookOpen,
} from "lucide-react";

const tooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #1F2937",
  borderRadius: "8px",
  color: "#F9FAFB",
  fontSize: 13,
};

function CertChecklist({ items }: { items: CertificationItem[] }) {
  return (
    <div className="space-y-2 mt-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-2">
          {item.met ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-nx-accent shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-3.5 w-3.5 text-nx-text-muted shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`text-xs ${item.met ? "text-nx-text" : "text-nx-text-muted"}`}>
              {item.label}
            </p>
            <p className="text-[10px] text-nx-text-muted">{item.source}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CertificationsSection() {
  const { client } = useClientData();

  // Build a temporary full ClientDetail to pass to calculation functions
  const fullClient: ClientDetail = useMemo(
    () => ({
      ...client,
      equipment: mockEquipment,
      plant_profile: mockPlantProfile,
    }),
    [client]
  );

  const certs = useMemo(
    () => calculateCertificationReadiness(fullClient),
    [fullClient]
  );
  const fiscalBenefits = useMemo(
    () => calculateFiscalBenefits(client.proposed_solutions),
    [client.proposed_solutions]
  );
  const envImpact = useMemo(
    () => calculateEnvironmentalImpact(client.invoices, client.proposed_solutions),
    [client.invoices, client.proposed_solutions]
  );
  const projection = useMemo(
    () => calculateFinancialProjection(client.proposed_solutions),
    [client.proposed_solutions]
  );

  return (
    <div className="space-y-8">
      {/* Section 1: Certificaciones */}
      <div>
        <SectionHeader
          title="Certificaciones"
          description="Nivel de preparacion basado en los datos disponibles"
          icon={Award}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* CONUEE */}
          <Card>
            <div className="flex items-start gap-4">
              <ProgressRing value={certs.conuee_pct} color="primary" size={70} />
              <div>
                <p className="text-sm font-semibold text-nx-text">CONUEE</p>
                <p className="text-[11px] text-nx-text-muted">
                  Diagnostico Energetico
                </p>
              </div>
            </div>
            <CertChecklist items={certs.conuee_items} />
            <div className="mt-3 p-2.5 rounded-lg bg-nx-primary-bg/30 border border-nx-primary/10">
              <p className="text-[11px] text-nx-primary">
                Con 12 recibos CFE + inventario de equipos, tienes el{" "}
                <span className="font-semibold">{certs.conuee_pct}%</span> del
                diagnostico energetico CONUEE
              </p>
            </div>
          </Card>

          {/* LEED */}
          <Card>
            <div className="flex items-start gap-4">
              <ProgressRing value={certs.leed_pct} color="accent" size={70} />
              <div>
                <p className="text-sm font-semibold text-nx-text">LEED v4.1</p>
                <p className="text-[11px] text-nx-text-muted">
                  Creditos EA (Energia y Atmosfera)
                </p>
              </div>
            </div>
            <CertChecklist items={certs.leed_items} />
            <div className="mt-3 p-2.5 rounded-lg bg-nx-accent-bg/30 border border-nx-accent/10">
              <p className="text-[11px] text-nx-accent">
                Tus datos cubren{" "}
                <span className="font-semibold">{certs.leed_pct}%</span> de los
                requisitos para creditos LEED EA
              </p>
            </div>
          </Card>

          {/* ISO 50001 */}
          <Card>
            <div className="flex items-start gap-4">
              <ProgressRing value={certs.iso50001_pct} color="warning" size={70} />
              <div>
                <p className="text-sm font-semibold text-nx-text">ISO 50001</p>
                <p className="text-[11px] text-nx-text-muted">
                  Sistema de Gestion de Energia
                </p>
              </div>
            </div>
            <CertChecklist items={certs.iso50001_items} />
            <div className="mt-3 p-2.5 rounded-lg bg-nx-warning-bg/30 border border-nx-warning/10">
              <p className="text-[11px] text-nx-warning">
                Con monitoreo en tiempo real llegarias a certificacion{" "}
                <span className="font-semibold">ISO 50001</span>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Section 2: Beneficios Fiscales */}
      <div>
        <SectionHeader
          title="Beneficios Fiscales"
          description="Incentivos y deducciones aplicables a tu inversion"
          icon={BookOpen}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {fiscalBenefits.map((benefit) => (
            <Card key={benefit.id}>
              <p className="text-sm font-semibold text-nx-text">{benefit.name}</p>
              <p className="text-xs text-nx-text-muted mt-1 leading-relaxed">
                {benefit.description}
              </p>
              <p className="text-[10px] font-mono text-nx-text-muted mt-2 bg-nx-surface rounded px-2 py-1">
                {benefit.legal_reference}
              </p>
              <p className="text-sm font-semibold text-nx-accent mt-2">
                Estimado: {formatCurrency(benefit.estimated_value_mxn)}
              </p>
              {!benefit.applicable && (
                <Badge variant="default" className="mt-1">
                  Requiere condiciones adicionales
                </Badge>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Section 3: Impacto Ambiental */}
      <div>
        <SectionHeader
          title="Impacto Ambiental"
          description="Emisiones actuales y potencial de reduccion"
          icon={Leaf}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <StatCard
            title="CO2 actual"
            value={`${envImpact.total_co2_tons} ton/ano`}
            subtitle="Emisiones indirectas (Alcance 2)"
            icon={Flame}
            iconColor="text-orange-400"
            iconBg="bg-orange-400/10"
          />
          <StatCard
            title="Reduccion potencial"
            value={`${envImpact.reduction_potential_tons} ton/ano`}
            subtitle="Con soluciones propuestas"
            icon={Leaf}
            iconColor="text-nx-accent"
            iconBg="bg-nx-accent-bg"
          />
          <StatCard
            title="Arboles equivalentes"
            value={formatNumber(envImpact.tree_equivalents)}
            subtitle="Equivalente a plantar"
            icon={TreePine}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-500/10"
          />
          <StatCard
            title="Autos retirados"
            value={`${envImpact.car_equivalents}`}
            subtitle="Equivalente en autos/ano"
            icon={Car}
            iconColor="text-sky-400"
            iconBg="bg-sky-400/10"
          />
        </div>
      </div>

      {/* Section 4: Proyeccion Financiera */}
      <div>
        <SectionHeader
          title="Proyeccion Financiera"
          description="Retorno de inversion a 10 anos"
          icon={TrendingUp}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <StatCard
            title="Inversion total"
            value={formatCurrency(projection.totalInvestment)}
            icon={DollarSign}
            iconColor="text-nx-danger"
            iconBg="bg-nx-danger-bg"
          />
          <StatCard
            title="Ahorro anual"
            value={formatCurrency(projection.annualSavings)}
            icon={TrendingUp}
            iconColor="text-nx-accent"
            iconBg="bg-nx-accent-bg"
          />
          <StatCard
            title="ROI promedio"
            value={`${projection.avgRoiMonths} meses`}
            subtitle="Periodo de recuperacion promedio"
            icon={ShieldCheck}
            iconColor="text-nx-primary"
            iconBg="bg-nx-primary-bg"
          />
        </div>

        {/* Cumulative savings chart */}
        <Card className="mt-4">
          <CardTitle>Ahorros acumulados vs inversion (10 anos)</CardTitle>
          <div className="h-[340px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={projection.cumulativeSavings}
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickFormatter={(y: number) => `Ano ${y}`}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  tickFormatter={(v: number) =>
                    `$${(v / 1_000_000).toFixed(1)}M`
                  }
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: unknown, name: unknown) => [
                    formatCurrency(Number(value)),
                    name === "savings" ? "Ahorros acumulados" : "Ahorro neto",
                  ]}
                  labelFormatter={(y: unknown) => `Ano ${y}`}
                />
                <ReferenceLine
                  y={projection.totalInvestment}
                  stroke="#EF4444"
                  strokeDasharray="6 4"
                  label={{
                    value: `Inversion: ${formatCurrency(projection.totalInvestment)}`,
                    position: "right",
                    fill: "#EF4444",
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  name="savings"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-nx-text-muted mt-2">
            El punto de cruce entre la linea roja (inversion) y la curva verde
            (ahorros) marca el periodo de recuperacion de la inversion.
          </p>
        </Card>
      </div>
    </div>
  );
}
