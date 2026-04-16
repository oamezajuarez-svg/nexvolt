"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { costBreakdown } from "@/lib/mock-client-detail";
import { FileText } from "lucide-react";
import {
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
} from "recharts";
import { useClientData } from "../shared/client-data-context";
import { useComputedData } from "../shared/use-computed";
import { tooltipStyle } from "../shared/config";
import { CFEUpload } from "@/components/cfe-upload";
import { useRouter } from "next/navigation";

export function CFESection() {
  const { client, orgId } = useClientData();
  const router = useRouter();
  const {
    consumptionBreakdown,
    demandData,
    pfData,
    totalAnnualCost,
    avgPF,
    totalPFPenalty,
    maxDemand,
  } = useComputedData();

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

      {/* Upload CFE bills */}
      {orgId !== "demo" && (
        <CFEUpload orgId={orgId} onSaved={() => router.refresh()} />
      )}

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
