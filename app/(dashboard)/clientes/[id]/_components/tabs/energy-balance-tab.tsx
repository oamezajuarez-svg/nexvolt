"use client";

import { useMemo } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { mockEquipment } from "@/lib/mock-equipment";
import { mockPlantProfile } from "@/lib/mock-plant-profile";
import {
  calculateEnergyBalance,
  calculateEnergyIntensity,
} from "@/lib/calculations/energy-balance";
import { ENERGY_INTENSITY_BENCHMARKS } from "@/lib/standards/efficiency";
import { useClientData } from "../shared/client-data-context";
import { tooltipStyle } from "../shared/config";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Zap,
  Cpu,
  AlertTriangle,
  Activity,
} from "lucide-react";

const categoryColors: Record<string, string> = {
  motor: "#3B82F6",
  lighting: "#EAB308",
  hvac: "#06B6D4",
  compressed_air: "#8B5CF6",
  other: "#6B7280",
};

export function EnergyBalanceSection() {
  const { client } = useClientData();

  const balance = useMemo(
    () => calculateEnergyBalance(mockEquipment, client.invoices),
    [client.invoices]
  );

  const intensity = useMemo(
    () => calculateEnergyIntensity(balance.totalInvoicedKwh, mockPlantProfile),
    [balance.totalInvoicedKwh]
  );

  const benchmark = ENERGY_INTENSITY_BENCHMARKS.manufacturing_general;

  const pieData = balance.categories.map((cat) => ({
    name: cat.category,
    value: cat.annual_kwh,
    color: categoryColors[cat.equipment_category] ?? "#6B7280",
  }));

  const unaccountedWarning = balance.unaccountedPct > 15;

  return (
    <div className="space-y-6">
      {/* ── Top stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total facturado"
          value={`${formatNumber(balance.totalInvoicedKwh)} kWh`}
          subtitle="Consumo anual segun recibos CFE"
          icon={Zap}
          iconColor="text-nx-primary"
          iconBg="bg-nx-primary-bg"
        />
        <StatCard
          title="Total estimado equipos"
          value={`${formatNumber(balance.totalEquipmentKwh)} kWh`}
          subtitle="Consumo calculado del inventario de equipos"
          icon={Cpu}
          iconColor="text-nx-accent"
          iconBg="bg-nx-accent-bg"
        />
        <StatCard
          title="Energia no contabilizada"
          value={`${balance.unaccountedPct.toFixed(1)}%`}
          subtitle={`${formatNumber(balance.unaccountedKwh)} kWh sin asignar`}
          icon={AlertTriangle}
          iconColor={unaccountedWarning ? "text-nx-danger" : "text-nx-warning"}
          iconBg={unaccountedWarning ? "bg-nx-danger-bg" : "bg-nx-warning-bg"}
          valueColor={unaccountedWarning ? "text-nx-danger" : undefined}
        />
      </div>

      {/* ── Middle: Chart + Table ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <Card>
          <CardTitle>Distribucion del consumo por categoria</CardTitle>
          <div className="h-[320px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }: any) =>
                    `${name ?? ""} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: unknown) => [
                    `${formatNumber(Number(value))} kWh/ano`,
                    "Consumo",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category table */}
        <Card>
          <CardTitle>Desglose por categoria</CardTitle>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left px-3 py-2 text-nx-text-muted font-medium border-b border-nx-border">
                    Categoria
                  </th>
                  <th className="text-left px-3 py-2 text-nx-text-muted font-medium border-b border-nx-border">
                    kWh/ano
                  </th>
                  <th className="text-left px-3 py-2 text-nx-text-muted font-medium border-b border-nx-border">
                    Costo MXN/ano
                  </th>
                  <th className="text-left px-3 py-2 text-nx-text-muted font-medium border-b border-nx-border">
                    % del total
                  </th>
                  <th className="text-left px-3 py-2 text-nx-text-muted font-medium border-b border-nx-border">
                    Equipos
                  </th>
                </tr>
              </thead>
              <tbody>
                {balance.categories.map((cat) => (
                  <tr key={cat.equipment_category} className="hover:bg-nx-surface/50">
                    <td className="px-3 py-2.5 text-nx-text border-b border-nx-border/50">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{
                            backgroundColor:
                              categoryColors[cat.equipment_category] ?? "#6B7280",
                          }}
                        />
                        {cat.category}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-nx-text border-b border-nx-border/50">
                      {formatNumber(cat.annual_kwh)}
                    </td>
                    <td className="px-3 py-2.5 text-nx-text border-b border-nx-border/50">
                      {formatCurrency(cat.annual_cost_mxn)}
                    </td>
                    <td className="px-3 py-2.5 text-nx-text border-b border-nx-border/50">
                      {cat.pct_of_total.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2.5 text-nx-text border-b border-nx-border/50">
                      {cat.equipment_count}
                    </td>
                  </tr>
                ))}
                {balance.unaccountedKwh > 0 && (
                  <tr className="hover:bg-nx-surface/50">
                    <td className="px-3 py-2.5 text-nx-warning border-b border-nx-border/50 font-medium">
                      No contabilizada
                    </td>
                    <td className="px-3 py-2.5 text-nx-warning border-b border-nx-border/50">
                      {formatNumber(balance.unaccountedKwh)}
                    </td>
                    <td className="px-3 py-2.5 text-nx-warning border-b border-nx-border/50">
                      {formatCurrency(balance.unaccountedKwh * 2.5)}
                    </td>
                    <td className="px-3 py-2.5 text-nx-warning border-b border-nx-border/50">
                      {balance.unaccountedPct.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2.5 text-nx-text-muted border-b border-nx-border/50">
                      —
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── Bottom: Energy intensity ── */}
      <Card>
        <SectionHeader
          title="Intensidad energetica"
          description="Indicadores de eficiencia por area y unidad producida"
          icon={Activity}
        />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-nx-surface">
              <p className="text-xs text-nx-text-muted">kWh / m² / ano</p>
              <p className="text-xl font-semibold text-nx-text mt-1">
                {intensity.kwh_per_m2}
              </p>
            </div>
            {intensity.kwh_per_unit !== null && (
              <div className="p-3 rounded-lg bg-nx-surface">
                <p className="text-xs text-nx-text-muted">
                  kWh / {mockPlantProfile.production_unit ?? "unidad"} producida
                </p>
                <p className="text-xl font-semibold text-nx-text mt-1">
                  {intensity.kwh_per_unit}
                </p>
              </div>
            )}
            <div className="p-3 rounded-lg bg-nx-surface">
              <p className="text-xs text-nx-text-muted">MJ / m² / ano</p>
              <p className="text-xl font-semibold text-nx-text mt-1">
                {intensity.mj_per_m2}
              </p>
            </div>
          </div>

          {/* Benchmark comparison */}
          <div className="space-y-4">
            <p className="text-xs font-medium text-nx-text">
              Comparativo vs benchmarks — {benchmark.sector}
            </p>

            {/* Actual */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-nx-text">Tu planta</span>
                <span className="font-medium text-nx-text">
                  {intensity.mj_per_m2} MJ/m²
                </span>
              </div>
              <div className="h-4 rounded-full bg-nx-surface overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-nx-primary transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (intensity.mj_per_m2 / (benchmark.typical * 1.5)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Typical */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-nx-text-muted">Tipico sector</span>
                <span className="font-medium text-nx-text-muted">
                  {benchmark.typical} {benchmark.unit}
                </span>
              </div>
              <div className="h-4 rounded-full bg-nx-surface overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-nx-warning/60 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (benchmark.typical / (benchmark.typical * 1.5)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Efficient */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-nx-text-muted">Eficiente</span>
                <span className="font-medium text-nx-accent">
                  {benchmark.efficient} {benchmark.unit}
                </span>
              </div>
              <div className="h-4 rounded-full bg-nx-surface overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-nx-accent/60 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (benchmark.efficient / (benchmark.typical * 1.5)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-nx-text-muted mt-4 border-t border-nx-border/50 pt-2">
          CONUEE Secciones 4-5 — Balance energetico e indicadores de desempeno
          energetico. Benchmarks: CONUEE / SENER indicadores sectoriales.
        </p>
      </Card>
    </div>
  );
}
