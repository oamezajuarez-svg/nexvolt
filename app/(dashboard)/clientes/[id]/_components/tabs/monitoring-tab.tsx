"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, CircleDot, ShieldCheck, Zap, BarChart3, AlertTriangle, Activity } from "lucide-react";
import { mockLive24h } from "@/lib/mock-client-detail";
import {
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { useClientData } from "../shared/client-data-context";
import { tooltipStyle } from "../shared/config";
import { useComputedData } from "../shared/use-computed";

function MonitoringEmptyState() {
  const { client } = useClientData();
  const { avgPF } = useComputedData();

  const cfeAnomalies = ["Factor de potencia", "Exceso de demanda", "Consumo en punta", "Variaciones de costo"];
  const hardwareAnomalies = ["Distorsion armonica (THD)", "Desbalance de fases", "Sags/swells de voltaje", "Perfil de carga en tiempo real", "Factor de potencia instantaneo", "Transitorios electricos"];

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <Card className="!p-0 overflow-hidden">
        <div className="px-6 py-5 border-b border-nx-border bg-gradient-to-r from-nx-primary/5 to-nx-accent/5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-nx-primary/10 border border-nx-primary/20">
              <Activity className="h-6 w-6 text-nx-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-nx-text">
                Monitoreo en tiempo real
              </h2>
              <p className="text-sm text-nx-text-muted mt-1 max-w-xl">
                Tu diagnostico actual se basa en recibos de CFE. Con hardware de monitoreo instalado,
                el sistema detecta problemas que los recibos no pueden ver y verifica el impacto real de cada solucion.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          {/* Personalized insight */}
          {avgPF > 0 && avgPF < 0.9 && (
            <div className="rounded-lg bg-nx-warning/5 border border-nx-warning/20 px-4 py-3 mb-5">
              <p className="text-sm text-nx-text">
                <strong className="text-nx-warning">Dato especifico de tu planta:</strong>{" "}
                Tu factor de potencia promedio es <strong>{avgPF.toFixed(2)}</strong>.
                Con monitoreo en tiempo real, podemos identificar <em>exactamente cual equipo</em> genera
                la potencia reactiva y optimizar la correccion, en vez de sobredimensionar el banco de capacitores.
              </p>
            </div>
          )}

          {/* Comparison table */}
          <h3 className="text-sm font-medium text-nx-text-secondary mb-3">
            Que detecta cada fuente de datos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* CFE column */}
            <div className="rounded-lg border border-nx-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-nx-primary" />
                <p className="text-xs font-semibold text-nx-primary">Solo recibos CFE</p>
                <Badge variant="primary">Actual</Badge>
              </div>
              <ul className="space-y-2">
                {cfeAnomalies.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-nx-text-secondary">
                    <ShieldCheck className="h-3.5 w-3.5 text-nx-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-nx-text-muted mt-3">
                Datos bimestrales, precision estimada
              </p>
            </div>

            {/* Hardware column */}
            <div className="rounded-lg border border-nx-primary/30 bg-nx-primary/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-nx-accent" />
                <p className="text-xs font-semibold text-nx-accent">CFE + Hardware</p>
                <Badge variant="accent">Piloto</Badge>
              </div>
              <ul className="space-y-2">
                {cfeAnomalies.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-nx-text-secondary">
                    <ShieldCheck className="h-3.5 w-3.5 text-nx-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
                {hardwareAnomalies.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-nx-text font-medium">
                    <Zap className="h-3.5 w-3.5 text-nx-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-nx-text-muted mt-3">
                Datos cada segundo, precision medida
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Precision del diagnostico", cfe: "70%", hw: "95%+" },
              { label: "Tiempo de deteccion", cfe: "2 meses", hw: "Instantaneo" },
              { label: "Verificacion de ahorros", cfe: "No posible", hw: "En tiempo real" },
            ].map((row) => (
              <div key={row.label} className="rounded-lg bg-nx-surface/50 border border-nx-border p-3 text-center">
                <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">{row.label}</p>
                <p className="text-xs text-nx-text-secondary mt-1 line-through">{row.cfe}</p>
                <p className="text-sm font-semibold text-nx-accent mt-0.5">{row.hw}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-5 rounded-lg bg-nx-accent/10 border border-nx-accent/20 px-4 py-4 text-center">
            <p className="text-sm font-medium text-nx-text mb-1">
              Solicita un piloto de monitoreo
            </p>
            <p className="text-xs text-nx-text-muted mb-3">
              Instalamos sensores en tu tablero principal por 30 dias. Sin costo si contratas el servicio despues.
            </p>
            <a
              href="mailto:contacto@nexvolt.mx?subject=Solicitud%20de%20piloto%20de%20monitoreo&body=Me%20interesa%20un%20piloto%20de%20monitoreo%20para%20mi%20planta."
              className="inline-flex items-center gap-2 rounded-lg bg-nx-accent text-white px-6 py-2.5 text-sm font-medium hover:bg-nx-accent/90 transition-colors"
            >
              <Activity className="h-4 w-4" />
              Solicitar piloto
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function MonitoringSection() {
  const { client } = useClientData();

  const devices = client.monitoring_devices;

  // Show hardware value proposition if no devices
  if (!devices || devices.length === 0) {
    return <MonitoringEmptyState />;
  }

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
