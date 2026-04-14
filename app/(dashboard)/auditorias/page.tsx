"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { mockClients } from "@/lib/mock-data";
import { mockAuditProgress } from "@/lib/mock-audit-progress";
import { ClipboardCheck, Users, BarChart3, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AuditoriasPage() {
  const allProgress = mockClients.map((c) => ({
    client: c,
    progress: mockAuditProgress[c.id],
  }));

  const avgPct =
    allProgress.reduce((sum, p) => sum + (p.progress?.overall_pct ?? 0), 0) /
    allProgress.length;

  const readyCount = allProgress.filter(
    (p) => (p.progress?.overall_pct ?? 0) >= 80
  ).length;

  return (
    <div className="p-8 space-y-6">
      <SectionHeader
        icon={ClipboardCheck}
        title="Auditorías Energéticas"
        description="Progreso de diagnóstico energético por cliente"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total clientes"
          value={String(mockClients.length)}
          icon={Users}
          iconColor="text-nx-primary"
          iconBg="bg-nx-primary-bg"
        />
        <StatCard
          title="Promedio completado"
          value={`${Math.round(avgPct)}%`}
          icon={BarChart3}
          iconColor="text-nx-warning"
          iconBg="bg-nx-warning-bg"
        />
        <StatCard
          title="Listos para reporte"
          value={String(readyCount)}
          subtitle="Clientes con ≥80% completado"
          icon={CheckCircle}
          iconColor="text-nx-accent"
          iconBg="bg-nx-accent-bg"
        />
      </div>

      {/* Audit table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nx-border text-left">
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted">Cliente</th>
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted">Recibos CFE</th>
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted">Equipos</th>
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted">Perfil Planta</th>
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted min-w-[160px]">Progreso Total</th>
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {allProgress.map(({ client, progress }) => {
                const overall = progress?.overall_pct ?? 0;
                const invoiceStep = progress?.steps.find((s) => s.id === "invoices");
                const equipmentStep = progress?.steps.find((s) => s.id === "equipment");
                const plantStep = progress?.steps.find((s) => s.id === "plant");

                const invoiceCount = invoiceStep
                  ? Math.round((invoiceStep.pct / 100) * 12)
                  : 0;
                const equipmentCount = equipmentStep && equipmentStep.pct > 0
                  ? Math.round((equipmentStep.pct / 100) * 20)
                  : null;
                const plantDone = plantStep ? plantStep.status === "complete" : false;

                const statusVariant =
                  overall >= 80 ? "accent" as const :
                  overall > 0 ? "primary" as const :
                  "default" as const;
                const statusLabel =
                  overall >= 80 ? "Completo" :
                  overall > 0 ? "En progreso" :
                  "Pendiente";

                return (
                  <tr
                    key={client.id}
                    className="border-b border-nx-border/50 hover:bg-nx-surface/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/clientes/${client.id}`}
                        className="text-sm font-medium text-nx-text hover:text-nx-primary transition-colors"
                      >
                        {client.name}
                      </Link>
                      <p className="text-xs text-nx-text-muted">{client.industry} — {client.location}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-nx-text">
                      {invoiceCount}/12
                    </td>
                    <td className="px-4 py-3 text-sm text-nx-text">
                      {equipmentCount !== null ? equipmentCount : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {plantDone ? (
                        <span className="text-nx-accent">✓</span>
                      ) : (
                        <span className="text-nx-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ProgressBar
                        value={overall}
                        size="sm"
                        color={overall >= 80 ? "accent" : overall >= 40 ? "primary" : "warning"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant}>{statusLabel}</Badge>
                    </td>
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
