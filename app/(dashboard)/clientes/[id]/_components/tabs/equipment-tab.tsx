"use client";

import { useState, useMemo } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubTabs } from "@/components/ui/sub-tabs";
import { SectionHeader } from "@/components/ui/section-header";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  mockEquipment,
  mockMotors,
  mockLighting,
  mockHVAC,
  mockCompressedAir,
  mockOther,
} from "@/lib/mock-equipment";
import { calculateEquipmentConsumption } from "@/lib/calculations/energy-balance";
import { ILLUMINATION_LEVELS } from "@/lib/standards/illumination";
import { client } from "../shared/config";
import type {
  Equipment,
  MotorEquipment,
  LightingEquipment,
  HVACEquipment,
  CompressedAirEquipment,
  OtherEquipment,
  EfficiencyFlag,
  EquipmentSummary,
} from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Cog, Lightbulb, Wind, Gauge, Package, BarChart3 } from "lucide-react";

const tooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #1F2937",
  borderRadius: "8px",
  color: "#F9FAFB",
  fontSize: 13,
};

const subTabs = [
  { id: "motors", label: "Motores", count: mockMotors.length },
  { id: "lighting", label: "Iluminacion", count: mockLighting.length },
  { id: "hvac", label: "HVAC", count: mockHVAC.length },
  { id: "compressed_air", label: "Aire Comprimido", count: mockCompressedAir.length },
  { id: "other", label: "Otros", count: mockOther.length },
  { id: "summary", label: "Resumen" },
];

const categoryColors: Record<string, string> = {
  motor: "#3B82F6",
  lighting: "#EAB308",
  hvac: "#06B6D4",
  compressed_air: "#8B5CF6",
  other: "#6B7280",
};

const categoryLabels: Record<string, string> = {
  motor: "Motores",
  lighting: "Iluminacion",
  hvac: "HVAC",
  compressed_air: "Aire comprimido",
  other: "Otros",
};

function EfficiencyBadge({ flag, detail }: { flag: EfficiencyFlag; detail: string }) {
  const config: Record<EfficiencyFlag, { label: string; variant: "accent" | "danger" | "default" }> = {
    compliant: { label: "Cumple norma", variant: "accent" },
    below_standard: { label: "Bajo estandar", variant: "danger" },
    unknown: { label: "Sin datos", variant: "default" },
  };
  const c = config[flag];
  return (
    <div>
      <Badge variant={c.variant}>{c.label}</Badge>
      <p className="text-[10px] text-nx-text-muted mt-0.5 max-w-[180px]">{detail}</p>
    </div>
  );
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-3 py-2 text-nx-text-muted font-medium border-b border-nx-border ${className ?? ""}`}>
      {children}
    </th>
  );
}

function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={`px-3 py-2.5 text-nx-text border-b border-nx-border/50 ${className ?? ""}`}>
      {children}
    </td>
  );
}

// ─── Motors table ───
function MotorsTable() {
  const rows = mockMotors.map((m) => ({
    eq: m,
    summary: calculateEquipmentConsumption(m),
  }));
  const totalKwh = rows.reduce((s, r) => s + r.summary.annual_kwh, 0);
  const totalCost = rows.reduce((s, r) => s + r.summary.annual_cost_mxn, 0);

  return (
    <Card>
      <TableWrapper>
        <thead>
          <tr>
            <Th>Nombre</Th>
            <Th>HP</Th>
            <Th>kW</Th>
            <Th>Voltaje</Th>
            <Th>Eficiencia %</Th>
            <Th>Factor carga</Th>
            <Th>Horas/dia</Th>
            <Th>kWh/ano</Th>
            <Th>Eficiencia</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ eq, summary }) => (
            <tr key={eq.id} className="hover:bg-nx-surface/50">
              <Td className="font-medium">{eq.name}</Td>
              <Td>{eq.rated_hp}</Td>
              <Td>{eq.rated_kw}</Td>
              <Td>{eq.voltage}V</Td>
              <Td>{eq.efficiency_pct !== null ? `${eq.efficiency_pct}%` : "N/D"}</Td>
              <Td>{eq.load_factor_pct}%</Td>
              <Td>{eq.hours_per_day}</Td>
              <Td>{formatNumber(summary.annual_kwh)}</Td>
              <Td>
                <EfficiencyBadge flag={summary.efficiency_flag} detail={summary.efficiency_detail} />
              </Td>
            </tr>
          ))}
          <tr className="bg-nx-surface/30 font-semibold">
            <Td className="font-semibold">Total</Td>
            <Td />
            <Td />
            <Td />
            <Td />
            <Td />
            <Td />
            <Td className="font-semibold">{formatNumber(totalKwh)}</Td>
            <Td />
          </tr>
        </tbody>
      </TableWrapper>
      <p className="text-[10px] text-nx-text-muted mt-3 px-3">
        Costo estimado anual: {formatCurrency(totalCost)}
      </p>
    </Card>
  );
}

// ─── Lighting table ───
function LightingTable() {
  const rows = mockLighting.map((l) => ({
    eq: l,
    summary: calculateEquipmentConsumption(l),
    requiredLux: ILLUMINATION_LEVELS[l.required_lux_nom025]?.value ?? null,
  }));
  const totalKwh = rows.reduce((s, r) => s + r.summary.annual_kwh, 0);
  const totalCost = rows.reduce((s, r) => s + r.summary.annual_cost_mxn, 0);

  return (
    <Card>
      <TableWrapper>
        <thead>
          <tr>
            <Th>Area</Th>
            <Th>Tipo</Th>
            <Th>Cantidad</Th>
            <Th>W/unidad</Th>
            <Th>W total</Th>
            <Th>Area m²</Th>
            <Th>Lux actuales</Th>
            <Th>Lux NOM-025</Th>
            <Th>kWh/ano</Th>
            <Th>Eficiencia</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ eq, summary, requiredLux }) => (
            <tr key={eq.id} className="hover:bg-nx-surface/50">
              <Td className="font-medium">{eq.area_name}</Td>
              <Td>{eq.lamp_type.toUpperCase()}</Td>
              <Td>{eq.quantity}</Td>
              <Td>{eq.wattage_per_unit}</Td>
              <Td>{formatNumber(eq.quantity * eq.wattage_per_unit)}</Td>
              <Td>{formatNumber(eq.area_m2)}</Td>
              <Td>{eq.current_lux ?? "N/D"}</Td>
              <Td>{requiredLux ?? "N/D"}</Td>
              <Td>{formatNumber(summary.annual_kwh)}</Td>
              <Td>
                <EfficiencyBadge flag={summary.efficiency_flag} detail={summary.efficiency_detail} />
              </Td>
            </tr>
          ))}
          <tr className="bg-nx-surface/30 font-semibold">
            <Td className="font-semibold">Total</Td>
            <Td />
            <Td />
            <Td />
            <Td />
            <Td />
            <Td />
            <Td />
            <Td className="font-semibold">{formatNumber(totalKwh)}</Td>
            <Td />
          </tr>
        </tbody>
      </TableWrapper>
      <p className="text-[10px] text-nx-text-muted mt-3 px-3">
        Costo estimado anual: {formatCurrency(totalCost)}
      </p>
    </Card>
  );
}

// ─── HVAC table ───
function HVACTable() {
  const rows = mockHVAC.map((h) => ({
    eq: h,
    summary: calculateEquipmentConsumption(h),
  }));
  const totalKwh = rows.reduce((s, r) => s + r.summary.annual_kwh, 0);
  const totalCost = rows.reduce((s, r) => s + r.summary.annual_cost_mxn, 0);

  return (
    <Card>
      <TableWrapper>
        <thead>
          <tr>
            <Th>Nombre</Th>
            <Th>Tipo</Th>
            <Th>Capacidad TR</Th>
            <Th>EER/COP</Th>
            <Th>Horas/dia</Th>
            <Th>kWh/ano</Th>
            <Th>Eficiencia</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ eq, summary }) => (
            <tr key={eq.id} className="hover:bg-nx-surface/50">
              <Td className="font-medium">{eq.name}</Td>
              <Td>{eq.hvac_type}</Td>
              <Td>{eq.capacity_tr ?? "N/D"}</Td>
              <Td>
                {eq.eer ? `EER ${eq.eer}` : ""}
                {eq.eer && eq.cop ? " / " : ""}
                {eq.cop ? `COP ${eq.cop}` : ""}
                {!eq.eer && !eq.cop ? "N/D" : ""}
              </Td>
              <Td>{eq.hours_per_day}</Td>
              <Td>{formatNumber(summary.annual_kwh)}</Td>
              <Td>
                <EfficiencyBadge flag={summary.efficiency_flag} detail={summary.efficiency_detail} />
              </Td>
            </tr>
          ))}
          <tr className="bg-nx-surface/30 font-semibold">
            <Td className="font-semibold">Total</Td>
            <Td />
            <Td />
            <Td />
            <Td />
            <Td className="font-semibold">{formatNumber(totalKwh)}</Td>
            <Td />
          </tr>
        </tbody>
      </TableWrapper>
      <p className="text-[10px] text-nx-text-muted mt-3 px-3">
        Costo estimado anual: {formatCurrency(totalCost)}
      </p>
    </Card>
  );
}

// ─── Compressed air table ───
function CompressedAirTable() {
  const rows = mockCompressedAir.map((c) => ({
    eq: c,
    summary: calculateEquipmentConsumption(c),
  }));
  const totalKwh = rows.reduce((s, r) => s + r.summary.annual_kwh, 0);
  const totalCost = rows.reduce((s, r) => s + r.summary.annual_cost_mxn, 0);

  return (
    <Card>
      <TableWrapper>
        <thead>
          <tr>
            <Th>Nombre</Th>
            <Th>Tipo</Th>
            <Th>HP</Th>
            <Th>PSI</Th>
            <Th>CFM</Th>
            <Th>Horas/dia</Th>
            <Th>kWh/ano</Th>
            <Th>Eficiencia</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ eq, summary }) => (
            <tr key={eq.id} className="hover:bg-nx-surface/50">
              <Td className="font-medium">{eq.name}</Td>
              <Td>{eq.compressor_type}</Td>
              <Td>{eq.rated_hp}</Td>
              <Td>{eq.pressure_psi}</Td>
              <Td>{eq.estimated_cfm}</Td>
              <Td>{eq.hours_per_day}</Td>
              <Td>{formatNumber(summary.annual_kwh)}</Td>
              <Td>
                <EfficiencyBadge flag={summary.efficiency_flag} detail={summary.efficiency_detail} />
              </Td>
            </tr>
          ))}
          <tr className="bg-nx-surface/30 font-semibold">
            <Td className="font-semibold">Total</Td>
            <Td />
            <Td />
            <Td />
            <Td />
            <Td />
            <Td className="font-semibold">{formatNumber(totalKwh)}</Td>
            <Td />
          </tr>
        </tbody>
      </TableWrapper>
      <p className="text-[10px] text-nx-text-muted mt-3 px-3">
        Costo estimado anual: {formatCurrency(totalCost)}
      </p>
    </Card>
  );
}

// ─── Other equipment table ───
function OtherTable() {
  const rows = mockOther.map((o) => ({
    eq: o,
    summary: calculateEquipmentConsumption(o),
  }));
  const totalKwh = rows.reduce((s, r) => s + r.summary.annual_kwh, 0);
  const totalCost = rows.reduce((s, r) => s + r.summary.annual_cost_mxn, 0);

  return (
    <Card>
      <TableWrapper>
        <thead>
          <tr>
            <Th>Nombre</Th>
            <Th>Tipo equipo</Th>
            <Th>kW</Th>
            <Th>Horas/dia</Th>
            <Th>kWh/ano</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ eq, summary }) => (
            <tr key={eq.id} className="hover:bg-nx-surface/50">
              <Td className="font-medium">{eq.name}</Td>
              <Td>{eq.equipment_type}</Td>
              <Td>{eq.rated_kw}</Td>
              <Td>{eq.hours_per_day}</Td>
              <Td>{formatNumber(summary.annual_kwh)}</Td>
            </tr>
          ))}
          <tr className="bg-nx-surface/30 font-semibold">
            <Td className="font-semibold">Total</Td>
            <Td />
            <Td />
            <Td />
            <Td className="font-semibold">{formatNumber(totalKwh)}</Td>
          </tr>
        </tbody>
      </TableWrapper>
      <p className="text-[10px] text-nx-text-muted mt-3 px-3">
        Costo estimado anual: {formatCurrency(totalCost)}
      </p>
    </Card>
  );
}

// ─── Summary sub-tab ───
function SummaryView() {
  const allSummaries = useMemo(() => {
    return mockEquipment.map((eq) => ({
      eq,
      summary: calculateEquipmentConsumption(eq),
    }));
  }, []);

  // Group by category
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    for (const { eq, summary } of allSummaries) {
      map.set(eq.category, (map.get(eq.category) ?? 0) + summary.annual_kwh);
    }
    return Array.from(map.entries())
      .map(([cat, kwh]) => ({
        name: categoryLabels[cat],
        value: kwh,
        color: categoryColors[cat],
      }))
      .sort((a, b) => b.value - a.value);
  }, [allSummaries]);

  // All equipment sorted by consumption
  const sortedEquipment = useMemo(() => {
    return [...allSummaries].sort((a, b) => b.summary.annual_kwh - a.summary.annual_kwh);
  }, [allSummaries]);

  const totalEquipmentKwh = allSummaries.reduce((s, r) => s + r.summary.annual_kwh, 0);
  const totalInvoicedKwh = client.invoices.reduce((s, inv) => s + inv.total_kwh, 0);
  const top5 = sortedEquipment.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <Card>
          <CardTitle>Consumo por categoria</CardTitle>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }: any) =>
                    `${name ?? ""} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, i) => (
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

        {/* Top 5 consumers */}
        <Card>
          <CardTitle>Top 5 consumidores</CardTitle>
          <div className="mt-4 space-y-3">
            {top5.map(({ eq, summary }, i) => {
              const pct = totalEquipmentKwh > 0 ? (summary.annual_kwh / totalEquipmentKwh) * 100 : 0;
              return (
                <div key={eq.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-nx-primary w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-nx-text truncate">{eq.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 rounded-full bg-nx-surface overflow-hidden">
                        <div
                          className="h-full rounded-full bg-nx-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-nx-text-muted shrink-0">
                        {formatNumber(summary.annual_kwh)} kWh
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-nx-surface">
            <div className="flex justify-between text-xs">
              <span className="text-nx-text-muted">Total estimado equipos</span>
              <span className="font-medium text-nx-text">
                {formatNumber(totalEquipmentKwh)} kWh/ano
              </span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-nx-text-muted">Total facturado CFE</span>
              <span className="font-medium text-nx-text">
                {formatNumber(totalInvoicedKwh)} kWh/ano
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Full equipment table */}
      <Card>
        <CardTitle>Todos los equipos por consumo</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <Th>#</Th>
                <Th>Nombre</Th>
                <Th>Categoria</Th>
                <Th>kWh/ano</Th>
                <Th>Costo/ano</Th>
                <Th>% del total</Th>
              </tr>
            </thead>
            <tbody>
              {sortedEquipment.map(({ eq, summary }, i) => {
                const pct = totalEquipmentKwh > 0
                  ? (summary.annual_kwh / totalEquipmentKwh) * 100
                  : 0;
                return (
                  <tr
                    key={eq.id}
                    className={`hover:bg-nx-surface/50 ${i < 5 ? "bg-nx-primary-bg/20" : ""}`}
                  >
                    <Td>{i + 1}</Td>
                    <Td className="font-medium">{eq.name}</Td>
                    <Td>{categoryLabels[eq.category]}</Td>
                    <Td>{formatNumber(summary.annual_kwh)}</Td>
                    <Td>{formatCurrency(summary.annual_cost_mxn)}</Td>
                    <Td>{pct.toFixed(1)}%</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Main component ───
export function EquipmentSection() {
  const [activeSubTab, setActiveSubTab] = useState("motors");

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Inventario de Equipos"
        description={`${mockEquipment.length} equipos registrados en 5 categorias`}
        icon={Package}
      />

      <SubTabs tabs={subTabs} active={activeSubTab} onChange={setActiveSubTab} />

      {activeSubTab === "motors" && <MotorsTable />}
      {activeSubTab === "lighting" && <LightingTable />}
      {activeSubTab === "hvac" && <HVACTable />}
      {activeSubTab === "compressed_air" && <CompressedAirTable />}
      {activeSubTab === "other" && <OtherTable />}
      {activeSubTab === "summary" && <SummaryView />}
    </div>
  );
}
