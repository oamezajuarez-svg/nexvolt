import type { StandardThreshold } from "./types";

// ============================================================
// LEED v4.1 — Créditos de Energía (EA)
// ============================================================

/**
 * LEED v4.1 EA Prerequisite: Minimum Energy Performance.
 * Todos los proyectos deben demostrar al menos 10% de mejora
 * sobre el baseline ASHRAE 90.1.
 */
export const LEED_EA_PREREQUISITE = {
  min_improvement: {
    value: 10,
    unit: "%",
    description: "Mejora mínima requerida sobre baseline ASHRAE 90.1 para certificación LEED",
    reference: {
      code: "LEED-EA-PRE",
      standard: "LEED v4.1 BD+C",
      section: "EA Prerequisite: Minimum Energy Performance",
      year: 2024,
      organization: "USGBC",
      url: "https://leeduser.buildinggreen.com/credit/NC-v4.1/EAc2",
    },
  } satisfies StandardThreshold,
};

/**
 * LEED v4.1 EA Credit: Optimize Energy Performance.
 * Puntos por nivel de reducción energética y de emisiones GEI.
 *
 * Escala de puntos (New Construction):
 * Se otorgan puntos separados por costo energético y por emisiones GEI,
 * hasta 9 puntos por cada métrica (18 puntos máximo).
 */
export const LEED_EA_OPTIMIZE = {
  /** Puntos por reducción de costo energético vs baseline */
  cost_reduction_points: [
    { min_reduction_pct: 6, points: 1 },
    { min_reduction_pct: 8, points: 2 },
    { min_reduction_pct: 10, points: 3 },
    { min_reduction_pct: 14, points: 4 },
    { min_reduction_pct: 18, points: 5 },
    { min_reduction_pct: 22, points: 6 },
    { min_reduction_pct: 26, points: 7 },
    { min_reduction_pct: 30, points: 8 },
    { min_reduction_pct: 35, points: 9 },
  ],

  /** Puntos por reducción de emisiones GEI vs baseline */
  ghg_reduction_points: [
    { min_reduction_pct: 6, points: 1 },
    { min_reduction_pct: 8, points: 2 },
    { min_reduction_pct: 10, points: 3 },
    { min_reduction_pct: 14, points: 4 },
    { min_reduction_pct: 18, points: 5 },
    { min_reduction_pct: 22, points: 6 },
    { min_reduction_pct: 26, points: 7 },
    { min_reduction_pct: 30, points: 8 },
    { min_reduction_pct: 35, points: 9 },
  ],

  max_points: 18,

  reference: {
    code: "LEED-EA-OPT",
    standard: "LEED v4.1 BD+C",
    section: "EA Credit: Optimize Energy Performance",
    year: 2024,
    organization: "USGBC",
    url: "https://leeduser.buildinggreen.com/credit/NC-v4.1/EAc2",
  },
} as const;

/**
 * Niveles de certificación LEED.
 */
export const LEED_CERTIFICATION_LEVELS = [
  { name: "Certified", min_points: 40, max_points: 49 },
  { name: "Silver", min_points: 50, max_points: 59 },
  { name: "Gold", min_points: 60, max_points: 79 },
  { name: "Platinum", min_points: 80, max_points: 110 },
] as const;

/**
 * Calcula puntos LEED EA por reducción energética.
 */
export function calculateLEEDPoints(
  costReductionPct: number,
  ghgReductionPct: number
): { costPoints: number; ghgPoints: number; totalPoints: number } {
  let costPoints = 0;
  for (const tier of LEED_EA_OPTIMIZE.cost_reduction_points) {
    if (costReductionPct >= tier.min_reduction_pct) costPoints = tier.points;
  }

  let ghgPoints = 0;
  for (const tier of LEED_EA_OPTIMIZE.ghg_reduction_points) {
    if (ghgReductionPct >= tier.min_reduction_pct) ghgPoints = tier.points;
  }

  return {
    costPoints,
    ghgPoints,
    totalPoints: costPoints + ghgPoints,
  };
}
