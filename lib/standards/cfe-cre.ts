import type { StandardThreshold, StandardFormula } from "./types";

// ============================================================
// CFE / CRE — Factor de Potencia
// ============================================================

/**
 * Umbrales de factor de potencia según disposiciones tarifarias CFE/CRE.
 *
 * A partir de 2024, para usuarios con demanda contratada ≥1 MW el mínimo
 * es 0.95. Para <1 MW se mantiene 0.90. En 2026 el mínimo sube a 0.97
 * para ≥1 MW.
 */
export const POWER_FACTOR_THRESHOLDS = {
  /** Mínimo para evitar penalización — demanda < 1 MW */
  minimum_under_1mw: {
    value: 0.9,
    unit: "adimensional",
    description: "Factor de potencia mínimo para usuarios con demanda contratada < 1 MW",
    reference: {
      code: "CFE-FP-90",
      standard: "Disposiciones complementarias a las tarifas de suministro de energía eléctrica",
      section: "Sección 3 — Factor de potencia",
      year: 2024,
      organization: "CFE / CRE",
      url: "https://www.cfe.gob.mx/industria/tarifas/Pages/disposiciones-complementariasant.aspx",
    },
  } satisfies StandardThreshold,

  /** Mínimo para evitar penalización — demanda ≥ 1 MW (vigente 2024-2025) */
  minimum_over_1mw: {
    value: 0.95,
    unit: "adimensional",
    description: "Factor de potencia mínimo para usuarios con demanda contratada ≥ 1 MW (vigente desde enero 2024)",
    reference: {
      code: "CFE-FP-95",
      standard: "Disposiciones complementarias a las tarifas de suministro de energía eléctrica",
      section: "Sección 3 — Factor de potencia, actualización 2024",
      year: 2024,
      organization: "CFE / CRE",
      url: "https://energiahoy.com/2024/01/18/nuevo-requisito-de-factor-de-potencia-como-evitar-pagar-este-cargo/",
    },
  } satisfies StandardThreshold,

  /** Mínimo para evitar penalización — demanda ≥ 1 MW (vigente 2026+) */
  minimum_over_1mw_2026: {
    value: 0.97,
    unit: "adimensional",
    description: "Factor de potencia mínimo para usuarios con demanda contratada ≥ 1 MW (vigente desde 2026)",
    reference: {
      code: "CFE-FP-97",
      standard: "Disposiciones complementarias a las tarifas de suministro de energía eléctrica",
      section: "Sección 3 — Factor de potencia, proyección 2026",
      year: 2026,
      organization: "CFE / CRE",
    },
  } satisfies StandardThreshold,

  /** FP óptimo recomendado por NexVolt (basado en mejor práctica industrial) */
  optimal: {
    value: 0.98,
    unit: "adimensional",
    description: "Factor de potencia óptimo recomendado (mejor práctica industrial)",
    reference: {
      code: "CFE-FP-OPT",
      standard: "Práctica recomendada para instalaciones industriales",
      section: "Factor de potencia objetivo",
      year: 2024,
      organization: "NexVolt / Industria",
    },
  } satisfies StandardThreshold,
};

/**
 * Fórmulas de penalización y bonificación por factor de potencia.
 * Ref: Disposiciones complementarias CFE.
 */
export const POWER_FACTOR_FORMULAS = {
  /**
   * Recargo por FP < 0.90
   * Porcentaje = (3/5) × ((90/FP) - 1) × 100
   * Máximo: 120%
   */
  penalty: {
    name: "Recargo por bajo factor de potencia",
    description: "Porcentaje de recargo aplicado al monto de facturación cuando FP < 90%",
    formula: "Recargo% = (3/5) × ((90/FP) - 1) × 100  [máximo 120%]",
    reference: {
      code: "CFE-FP-PEN",
      standard: "Disposiciones complementarias a las tarifas de suministro de energía eléctrica",
      section: "Sección 3 — Fórmula de recargo",
      year: 2024,
      organization: "CFE / CRE",
    },
  } satisfies StandardFormula,

  /**
   * Bonificación por FP ≥ 0.90
   * Porcentaje = (1/4) × (1 - (90/FP)) × 100
   * Máximo: 2.5%
   */
  bonus: {
    name: "Bonificación por alto factor de potencia",
    description: "Porcentaje de bonificación aplicado al monto de facturación cuando FP ≥ 90%",
    formula: "Bonificación% = (1/4) × (1 - (90/FP)) × 100  [máximo 2.5%]",
    reference: {
      code: "CFE-FP-BON",
      standard: "Disposiciones complementarias a las tarifas de suministro de energía eléctrica",
      section: "Sección 3 — Fórmula de bonificación",
      year: 2024,
      organization: "CFE / CRE",
    },
  } satisfies StandardFormula,
};

/**
 * Calcula el porcentaje de recargo o bonificación por factor de potencia.
 * Valores positivos = penalización, negativos = bonificación.
 */
export function calculatePowerFactorAdjustment(powerFactor: number): {
  percentage: number;
  type: "penalty" | "bonus" | "none";
  formula: StandardFormula;
} {
  if (powerFactor < 0.9) {
    const raw = (3 / 5) * ((90 / (powerFactor * 100)) - 1) * 100;
    const capped = Math.min(raw, 120);
    return { percentage: capped, type: "penalty", formula: POWER_FACTOR_FORMULAS.penalty };
  }

  if (powerFactor >= 0.9) {
    const raw = (1 / 4) * (1 - (90 / (powerFactor * 100))) * 100;
    const capped = Math.min(raw, 2.5);
    return { percentage: -capped, type: "bonus", formula: POWER_FACTOR_FORMULAS.bonus };
  }

  return { percentage: 0, type: "none", formula: POWER_FACTOR_FORMULAS.penalty };
}

// ============================================================
// CFE — Demanda facturable
// ============================================================

/**
 * Demanda facturable para tarifa GDMTH.
 * La demanda facturable es la mayor entre:
 *   - Demanda máxima medida en punta
 *   - Demanda máxima medida en intermedia × factor (generalmente 0.90)
 *   - Demanda contratada (si aplica mínimo)
 */
export const DEMAND_BILLING = {
  /** Factor de ajuste para demanda intermedia en GDMTH */
  intermediate_factor: {
    value: 0.90,
    unit: "factor",
    description: "Factor aplicado a la demanda intermedia para calcular demanda facturable en GDMTH",
    reference: {
      code: "CFE-DEM-INT",
      standard: "Tarifa GDMTH — Cargos por demanda",
      section: "Demanda facturable",
      year: 2024,
      organization: "CFE / CRE",
      url: "https://app.cfe.mx/Aplicaciones/CCFE/Tarifas/TarifasCREIndustria/Tarifas/GranDemandaMTH.aspx",
    },
  } satisfies StandardThreshold,

  /** Umbral de sobredemanda: porcentaje sobre demanda contratada */
  overdemand_threshold: {
    value: 1.05,
    unit: "factor",
    description: "Demanda medida > 105% de la contratada genera cargo por sobredemanda",
    reference: {
      code: "CFE-DEM-OVER",
      standard: "Tarifa GDMTH — Sobredemanda",
      section: "Cargos adicionales por exceder demanda contratada",
      year: 2024,
      organization: "CFE / CRE",
    },
  } satisfies StandardThreshold,
};

// ============================================================
// CFE — Tarifas aplicables
// ============================================================

export const CFE_TARIFF_INFO = {
  GDMTH: {
    name: "Gran Demanda en Media Tensión Horaria",
    description: "Para servicios en media tensión con demanda ≥ 100 kW. Diferencia horaria base/intermedia/punta.",
    voltage: "Media tensión (1-35 kV)",
    min_demand_kw: 100,
  },
  GDMTO: {
    name: "Gran Demanda en Media Tensión Ordinaria",
    description: "Para servicios en media tensión con demanda < 100 kW. Cargo único por energía.",
    voltage: "Media tensión (1-35 kV)",
    min_demand_kw: 0,
  },
  DIT: {
    name: "Demanda Industrial en Alta Tensión",
    description: "Para servicios en alta tensión con demanda ≥ 100 kW.",
    voltage: "Alta tensión (35-220 kV)",
    min_demand_kw: 100,
  },
  DIST: {
    name: "Demanda Industrial en Subtransmisión",
    description: "Para servicios en subtransmisión.",
    voltage: "Subtransmisión (69-138 kV)",
    min_demand_kw: 100,
  },
} as const;
