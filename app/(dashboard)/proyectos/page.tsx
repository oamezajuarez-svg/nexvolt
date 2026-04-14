"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/lib/mock-projects";
import { mockClients } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  FolderKanban,
  Briefcase,
  FileEdit,
  Hammer,
  DollarSign,
} from "lucide-react";

const solutionTypeLabels: Record<string, string> = {
  solar_pv: "Solar FV",
  bess: "BESS",
  capacitor_bank: "Capacitores",
  vfd: "VFD",
  led: "LED",
  mem_migration: "MEM",
};

const statusConfig: Record<string, { label: string; variant: "default" | "primary" | "warning" | "accent" }> = {
  proposal: { label: "Propuesta", variant: "default" },
  approved: { label: "Aprobado", variant: "primary" },
  in_progress: { label: "En ejecución", variant: "warning" },
  installed: { label: "Instalado", variant: "accent" },
  monitoring: { label: "Monitoreo", variant: "primary" },
};

export default function ProyectosPage() {
  const clientMap = new Map(mockClients.map((c) => [c.id, c.name]));

  const inProposal = mockProjects.filter((p) => p.status === "proposal").length;
  const inProgress = mockProjects.filter((p) => p.status === "in_progress").length;
  const totalInvestment = mockProjects.reduce((sum, p) => sum + p.investment, 0);

  return (
    <div className="p-8 space-y-6">
      <SectionHeader
        icon={FolderKanban}
        title="Proyectos"
        description="Gestión de proyectos de eficiencia energética"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total proyectos"
          value={String(mockProjects.length)}
          icon={Briefcase}
          iconColor="text-nx-primary"
          iconBg="bg-nx-primary-bg"
        />
        <StatCard
          title="En propuesta"
          value={String(inProposal)}
          icon={FileEdit}
          iconColor="text-nx-text-secondary"
          iconBg="bg-nx-surface"
        />
        <StatCard
          title="En ejecución"
          value={String(inProgress)}
          icon={Hammer}
          iconColor="text-nx-warning"
          iconBg="bg-nx-warning-bg"
        />
        <StatCard
          title="Inversión total"
          value={formatCurrency(totalInvestment)}
          icon={DollarSign}
          iconColor="text-nx-accent"
          iconBg="bg-nx-accent-bg"
        />
      </div>

      {/* Projects table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nx-border text-left">
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted">Proyecto</th>
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted">Cliente</th>
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted">Tipo</th>
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted text-right">Inversión</th>
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted text-right">Ahorro est.</th>
                <th className="px-4 py-3 text-xs font-medium text-nx-text-muted text-right">ROI</th>
              </tr>
            </thead>
            <tbody>
              {mockProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-nx-text-muted">
                    No hay proyectos registrados aún.
                  </td>
                </tr>
              ) : (
                mockProjects.map((proj) => {
                  const sc = statusConfig[proj.status] ?? statusConfig.proposal;
                  return (
                    <tr
                      key={proj.id}
                      className="border-b border-nx-border/50 hover:bg-nx-surface/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-nx-text">{proj.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-nx-text-muted">
                        {clientMap.get(proj.client_id) ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="primary">
                          {solutionTypeLabels[proj.type] ?? proj.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-nx-text text-right">
                        {formatCurrency(proj.investment)}
                      </td>
                      <td className="px-4 py-3 text-sm text-nx-accent text-right">
                        {formatCurrency(proj.estimated_savings)}
                      </td>
                      <td className="px-4 py-3 text-sm text-nx-text text-right">
                        {proj.roi_months.toFixed(1)} meses
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
