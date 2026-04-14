"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { mockClients } from "@/lib/mock-data";
import { mockAuditProgress } from "@/lib/mock-audit-progress";
import {
  FileBarChart,
  FileText,
  ClipboardCheck,
  Presentation,
  TrendingDown,
  FileX,
} from "lucide-react";

const reportTypes = [
  {
    title: "Resumen Ejecutivo",
    icon: FileText,
    description:
      "Resumen de hallazgos, anomalías detectadas y soluciones propuestas con ROI",
    requires: "12 recibos + análisis",
    minPct: 80,
  },
  {
    title: "Diagnóstico CONUEE",
    icon: ClipboardCheck,
    description:
      "Formato oficial de diagnóstico energético según lineamientos CONUEE",
    requires: "Perfil planta + recibos + inventario",
    minPct: 70,
  },
  {
    title: "Presentación Cliente",
    icon: Presentation,
    description:
      "Presentación visual para reunión con el cliente con gráficas y beneficios",
    requires: "Análisis completo",
    minPct: 80,
  },
  {
    title: "Reporte de Ahorro",
    icon: TrendingDown,
    description:
      "Análisis detallado de ahorros potenciales por solución con M&V (IPMVP)",
    requires: "Soluciones aprobadas",
    minPct: 90,
  },
];

export default function ReportesPage() {
  return (
    <div className="p-8 space-y-6">
      <SectionHeader
        icon={FileBarChart}
        title="Reportes"
        description="Genera reportes profesionales para tus clientes"
      />

      {/* Report type cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((rt) => {
          const Icon = rt.icon;
          const eligibleCount = mockClients.filter((c) => {
            const progress = mockAuditProgress[c.id];
            return progress && progress.overall_pct >= rt.minPct;
          }).length;

          return (
            <Card key={rt.title} className="flex flex-col">
              <div className="flex items-start gap-4">
                <div className="rounded-xl p-3 bg-nx-primary-bg shrink-0">
                  <Icon className="h-5 w-5 text-nx-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-nx-text">{rt.title}</h3>
                  <p className="text-xs text-nx-text-muted mt-1">{rt.description}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-nx-text-muted">Requiere:</span>
                  <span className="text-nx-text">{rt.requires}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-nx-text-muted">Clientes elegibles:</span>
                  <span className="text-nx-text font-medium">{eligibleCount}</span>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button
                  disabled
                  className="w-full rounded-lg bg-nx-primary/20 px-4 py-2 text-xs font-medium text-nx-primary opacity-50 cursor-not-allowed"
                >
                  Próximamente
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent reports */}
      <Card>
        <h3 className="text-sm font-medium text-nx-text mb-4">Reportes recientes</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-xl p-3 bg-nx-surface mb-3">
            <FileX className="h-6 w-6 text-nx-text-muted" />
          </div>
          <p className="text-sm text-nx-text-muted max-w-md">
            No hay reportes generados aún. Completa el diagnóstico de un cliente para
            generar tu primer reporte.
          </p>
        </div>
      </Card>
    </div>
  );
}
