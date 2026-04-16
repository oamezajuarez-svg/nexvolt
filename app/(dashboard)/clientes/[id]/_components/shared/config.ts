import {
  Sun,
  Battery,
  Cable,
  Waves,
  LampDesk,
  Zap,
} from "lucide-react";
import type {
  AnomalySeverity,
  SolutionUrgency,
  SolutionImpact,
} from "@/lib/types";

// ─── Config objects ───

export const severityConfig: Record<
  AnomalySeverity,
  { label: string; variant: "danger" | "warning" | "primary" | "default"; color: string }
> = {
  critical: { label: "Critico", variant: "danger", color: "text-nx-danger" },
  high: { label: "Alto", variant: "warning", color: "text-nx-warning" },
  medium: { label: "Medio", variant: "primary", color: "text-nx-primary" },
  low: { label: "Bajo", variant: "default", color: "text-nx-text-muted" },
};

export const urgencyConfig: Record<SolutionUrgency, { label: string; color: string; bg: string; border: string; variant: "danger" | "warning" | "primary" }> = {
  immediate: { label: "Accion inmediata", color: "text-nx-danger", bg: "bg-nx-danger-bg", border: "border-nx-danger/30", variant: "danger" },
  short_term: { label: "Corto plazo (1-6 meses)", color: "text-nx-warning", bg: "bg-nx-warning-bg", border: "border-nx-warning/30", variant: "warning" },
  medium_term: { label: "Mediano plazo (6-18 meses)", color: "text-nx-primary", bg: "bg-nx-primary-bg", border: "border-nx-primary/30", variant: "primary" },
};

export const impactConfig: Record<SolutionImpact, { label: string; variant: "accent" | "primary" | "default" }> = {
  high: { label: "Impacto alto", variant: "accent" },
  medium: { label: "Impacto medio", variant: "primary" },
  low: { label: "Impacto bajo", variant: "default" },
};

export const solutionTypeConfig: Record<
  string,
  { label: string; icon: typeof Sun; color: string; bg: string; description: string }
> = {
  solar_pv: {
    label: "Paneles Solares (FV)",
    icon: Sun,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    description: "Generacion fotovoltaica en techo o terreno para reducir compra de energia a CFE",
  },
  bess: {
    label: "Almacenamiento (BESS)",
    icon: Battery,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    description: "Baterias para peak shaving, desplazamiento de carga y respaldo",
  },
  capacitor_bank: {
    label: "Banco de Capacitores",
    icon: Cable,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    description: "Correccion de factor de potencia para eliminar penalizaciones CFE",
  },
  vfd: {
    label: "VFD / Filtros Armonicos",
    icon: Waves,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    description: "Variadores de frecuencia y filtros para calidad de energia",
  },
  led: {
    label: "Retrofit LED",
    icon: LampDesk,
    color: "text-yellow-300",
    bg: "bg-yellow-300/10",
    description: "Sustitucion de iluminacion por LED con controles inteligentes",
  },
  mem_migration: {
    label: "Migracion MEM",
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    description: "Cambio al Mercado Electrico Mayorista para mejores tarifas",
  },
};

export const tooltipStyle = {
  backgroundColor: "#111827",
  border: "1px solid #1F2937",
  borderRadius: "8px",
  color: "#F9FAFB",
  fontSize: 13,
};

// Solution grouping
export const urgencyOrder: Record<SolutionUrgency, number> = {
  immediate: 0,
  short_term: 1,
  medium_term: 2,
};

// Simulator effects
export const solEffects: Record<string, {
  pfOverride?: number;
  demandCutKw?: number;
  energyPct?: number;
  demandCostPct?: number;
  distPct?: number;
}> = {
  "sol-01": { pfOverride: 0.96 },
  "sol-02": { demandCutKw: 50, energyPct: 0.93 },
  "sol-03": { energyPct: 0.65, distPct: 0.65 },
  "sol-04": { energyPct: 0.97 },
  "sol-05": { energyPct: 0.88, distPct: 0.88 },
  "sol-06": { energyPct: 0.98 },
};
