"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react";
import type { AnomalySeverity, AnomalySource } from "@/lib/types";
import {
  client,
  severityConfig,
  totalAnomalyImpact,
} from "../shared/config";

export function AnomaliesSection() {
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
