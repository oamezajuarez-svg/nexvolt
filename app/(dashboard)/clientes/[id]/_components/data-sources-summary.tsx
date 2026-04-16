"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Radio,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Zap,
  Loader2,
} from "lucide-react";
import { useClientData } from "./shared/client-data-context";
import { runAnalysis } from "@/lib/engine/analyze";

export function DataSourcesSummary() {
  const { client, orgId } = useClientData();
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ anomalyCount: number; solutionCount: number } | null>(null);

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
              <Radio className={`h-4 w-4 ${deviceCount > 0 ? "text-nx-accent" : "text-nx-warning"}`} />
              <p className="text-xs font-semibold text-nx-text">Monitoreo en vivo</p>
            </div>
            <p className={`text-2xl font-bold ${deviceCount > 0 ? "text-nx-accent" : "text-nx-warning"}`}>{deviceCount}</p>
            <p className="text-[11px] text-nx-text-secondary mt-1">
              {deviceCount > 0
                ? `${onlineDevices}/${deviceCount} dispositivos en linea`
                : "Sin hardware instalado"}
            </p>
            <p className="text-[11px] text-nx-text-muted mt-0.5">
              {deviceCount > 0
                ? `Modelos: ${[...new Set(client.monitoring_devices.map((d) => d.model))].join(", ")}`
                : "Armonicos, voltaje y desbalance no detectables"}
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

        {/* Analyze button */}
        {invoiceCount >= 3 && orgId !== "demo" && (
          <div className="mt-4 rounded-lg bg-nx-primary/5 border border-nx-primary/20 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-nx-text">
                {anomalyCount === 0
                  ? `${invoiceCount} recibos listos para analizar`
                  : "Re-ejecutar analisis con datos actualizados"}
              </p>
              <p className="text-[11px] text-nx-text-muted mt-0.5">
                El motor analiza factor de potencia, demanda, consumo y costos para detectar anomalias y recomendar soluciones
              </p>
            </div>
            <Button
              size="md"
              disabled={analyzing}
              onClick={async () => {
                setAnalyzing(true);
                setResult(null);
                const res = await runAnalysis(orgId);
                setResult({ anomalyCount: res.anomalyCount, solutionCount: res.solutionCount });
                setAnalyzing(false);
                if (!res.error) {
                  router.refresh();
                }
              }}
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Ejecutar analisis
                </>
              )}
            </Button>
          </div>
        )}

        {result && (
          <div className="mt-3 rounded-lg bg-nx-accent/10 border border-nx-accent/20 px-4 py-2.5">
            <p className="text-xs text-nx-accent font-medium">
              Analisis completado: {result.anomalyCount} anomalias detectadas, {result.solutionCount} soluciones generadas
            </p>
          </div>
        )}

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
