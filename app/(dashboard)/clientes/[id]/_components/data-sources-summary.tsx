"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Radio,
  AlertTriangle,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import { client } from "./shared/config";

export function DataSourcesSummary() {
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
