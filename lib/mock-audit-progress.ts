import type { AuditProgress } from "./types";

/** Progreso de auditoría para los 5 clientes mock */
export const mockAuditProgress: Record<string, AuditProgress> = {
  "1": {
    client_id: "1",
    overall_pct: 78,
    steps: [
      { id: "info", label: "Datos del cliente", status: "complete", pct: 100 },
      { id: "plant", label: "Perfil de planta", status: "complete", pct: 100 },
      { id: "invoices", label: "Recibos CFE (12 meses)", status: "complete", pct: 100 },
      { id: "equipment", label: "Inventario de equipos", status: "partial", pct: 85 },
      { id: "analysis", label: "Análisis y diagnóstico", status: "partial", pct: 60 },
      { id: "report", label: "Reporte generado", status: "pending", pct: 0 },
    ],
  },
  "2": {
    client_id: "2",
    overall_pct: 42,
    steps: [
      { id: "info", label: "Datos del cliente", status: "complete", pct: 100 },
      { id: "plant", label: "Perfil de planta", status: "partial", pct: 50 },
      { id: "invoices", label: "Recibos CFE (12 meses)", status: "partial", pct: 67 },
      { id: "equipment", label: "Inventario de equipos", status: "pending", pct: 0 },
      { id: "analysis", label: "Análisis y diagnóstico", status: "pending", pct: 0 },
      { id: "report", label: "Reporte generado", status: "pending", pct: 0 },
    ],
  },
  "3": {
    client_id: "3",
    overall_pct: 55,
    steps: [
      { id: "info", label: "Datos del cliente", status: "complete", pct: 100 },
      { id: "plant", label: "Perfil de planta", status: "complete", pct: 100 },
      { id: "invoices", label: "Recibos CFE (12 meses)", status: "complete", pct: 100 },
      { id: "equipment", label: "Inventario de equipos", status: "pending", pct: 0 },
      { id: "analysis", label: "Análisis y diagnóstico", status: "pending", pct: 0 },
      { id: "report", label: "Reporte generado", status: "pending", pct: 0 },
    ],
  },
  "4": {
    client_id: "4",
    overall_pct: 18,
    steps: [
      { id: "info", label: "Datos del cliente", status: "complete", pct: 100 },
      { id: "plant", label: "Perfil de planta", status: "pending", pct: 0 },
      { id: "invoices", label: "Recibos CFE (12 meses)", status: "partial", pct: 25 },
      { id: "equipment", label: "Inventario de equipos", status: "pending", pct: 0 },
      { id: "analysis", label: "Análisis y diagnóstico", status: "pending", pct: 0 },
      { id: "report", label: "Reporte generado", status: "pending", pct: 0 },
    ],
  },
  "5": {
    client_id: "5",
    overall_pct: 8,
    steps: [
      { id: "info", label: "Datos del cliente", status: "partial", pct: 50 },
      { id: "plant", label: "Perfil de planta", status: "pending", pct: 0 },
      { id: "invoices", label: "Recibos CFE (12 meses)", status: "pending", pct: 0 },
      { id: "equipment", label: "Inventario de equipos", status: "pending", pct: 0 },
      { id: "analysis", label: "Análisis y diagnóstico", status: "pending", pct: 0 },
      { id: "report", label: "Reporte generado", status: "pending", pct: 0 },
    ],
  },
};
