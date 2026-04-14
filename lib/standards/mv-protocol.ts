import type { StandardThreshold, StandardFormula } from "./types";

// ============================================================
// ASHRAE Guideline 14-2014 — M&V Statistical Criteria
// ============================================================

/**
 * Criterios estadísticos para validar modelos de baseline energético.
 * Si un modelo de regresión no cumple estos criterios, no es confiable
 * para estimar ahorros.
 */
export const ASHRAE_14_CRITERIA = {
  /** Coeficiente de Variación del RMSE (mensual) */
  cv_rmse_monthly: {
    value: 15,
    unit: "%",
    description: "CV(RMSE) máximo aceptable para modelos de baseline con datos mensuales",
    reference: {
      code: "ASHRAE-14-CVRMSE-M",
      standard: "ASHRAE Guideline 14-2014",
      section: "Section 4.3.3 — Statistical criteria for model validation",
      year: 2014,
      organization: "ASHRAE",
    },
  } satisfies StandardThreshold,

  /** Coeficiente de Variación del RMSE (horario) */
  cv_rmse_hourly: {
    value: 25,
    unit: "%",
    description: "CV(RMSE) máximo aceptable para modelos de baseline con datos horarios",
    reference: {
      code: "ASHRAE-14-CVRMSE-H",
      standard: "ASHRAE Guideline 14-2014",
      section: "Section 4.3.3",
      year: 2014,
      organization: "ASHRAE",
    },
  } satisfies StandardThreshold,

  /** Error de sesgo normalizado (NMBE) mensual */
  nmbe_monthly: {
    value: 5,
    unit: "%",
    description: "NMBE máximo aceptable para modelos mensuales",
    reference: {
      code: "ASHRAE-14-NMBE-M",
      standard: "ASHRAE Guideline 14-2014",
      section: "Section 4.3.3",
      year: 2014,
      organization: "ASHRAE",
    },
  } satisfies StandardThreshold,

  /** Error de sesgo normalizado (NMBE) horario */
  nmbe_hourly: {
    value: 10,
    unit: "%",
    description: "NMBE máximo aceptable para modelos horarios",
    reference: {
      code: "ASHRAE-14-NMBE-H",
      standard: "ASHRAE Guideline 14-2014",
      section: "Section 4.3.3",
      year: 2014,
      organization: "ASHRAE",
    },
  } satisfies StandardThreshold,

  /** R² mínimo aceptable */
  r_squared_min: {
    value: 0.75,
    unit: "adimensional",
    description: "R² mínimo para considerar un modelo de baseline válido",
    reference: {
      code: "ASHRAE-14-R2",
      standard: "ASHRAE Guideline 14-2014",
      section: "Section 4.3.3 — Coefficient of determination",
      year: 2014,
      organization: "ASHRAE",
    },
  } satisfies StandardThreshold,
};

// ============================================================
// IPMVP — Opciones de M&V
// ============================================================

/**
 * Las 4 opciones de medición y verificación del IPMVP.
 * Cada proyecto de ahorro debe especificar cuál opción se usa.
 */
export const IPMVP_OPTIONS = {
  A: {
    name: "Opción A — Aislamiento del retrofit: medición parcial",
    description:
      "Se miden solo los parámetros clave del sistema modificado. " +
      "Los demás se estiman con datos históricos o ingeniería.",
    typical_use: [
      "Cambio de iluminación LED",
      "Reemplazo de motores",
      "Instalación de variadores de frecuencia",
    ],
    accuracy: "Moderada",
    cost: "Bajo",
    formula: {
      name: "Ahorros Opción A",
      description: "Ahorros = (Consumo estimado baseline) - (Consumo medido post-retrofit) ± Ajustes",
      formula: "Ahorros = E_base_estimado - E_post_medido ± Ajustes_rutinarios",
      reference: {
        code: "IPMVP-A",
        standard: "IPMVP Core Concepts 2022",
        section: "Chapter 6 — Option A: Retrofit Isolation, Key Parameter Measurement",
        year: 2022,
        organization: "EVO (Efficiency Valuation Organization)",
        url: "https://evo-world.org/en/products-services-mainmenu-en/protocols/ipmvp",
      },
    } satisfies StandardFormula,
  },

  B: {
    name: "Opción B — Aislamiento del retrofit: medición completa",
    description:
      "Se miden todos los parámetros energéticos del sistema modificado " +
      "antes y después del retrofit, con medición continua o periódica.",
    typical_use: [
      "Banco de capacitores",
      "Sistema de compresores",
      "Chiller / HVAC",
    ],
    accuracy: "Alta",
    cost: "Medio",
    formula: {
      name: "Ahorros Opción B",
      description: "Ahorros = (Consumo medido baseline) - (Consumo medido post-retrofit) ± Ajustes",
      formula: "Ahorros = E_base_medido - E_post_medido ± Ajustes",
      reference: {
        code: "IPMVP-B",
        standard: "IPMVP Core Concepts 2022",
        section: "Chapter 7 — Option B: Retrofit Isolation, All Parameter Measurement",
        year: 2022,
        organization: "EVO",
        url: "https://evo-world.org/en/products-services-mainmenu-en/protocols/ipmvp",
      },
    } satisfies StandardFormula,
  },

  C: {
    name: "Opción C — Planta completa",
    description:
      "Se analiza el consumo total de la instalación. Ideal cuando se " +
      "implementan múltiples medidas simultáneamente.",
    typical_use: [
      "Múltiples medidas de eficiencia",
      "Programa integral de ahorro",
      "Cuando no se puede aislar un sistema",
    ],
    accuracy: "Moderada-Alta",
    cost: "Bajo (usa facturas existentes)",
    formula: {
      name: "Ahorros Opción C",
      description: "Ahorros = (Consumo baseline ajustado) - (Consumo post periodo de reporte)",
      formula: "Ahorros = E_base_ajustado - E_reporte ± Ajustes_no_rutinarios",
      reference: {
        code: "IPMVP-C",
        standard: "IPMVP Core Concepts 2022",
        section: "Chapter 8 — Option C: Whole Facility",
        year: 2022,
        organization: "EVO",
        url: "https://evo-world.org/en/products-services-mainmenu-en/protocols/ipmvp",
      },
    } satisfies StandardFormula,
  },

  D: {
    name: "Opción D — Simulación calibrada",
    description:
      "Se usa un modelo de simulación energética calibrado para " +
      "estimar ahorros. Útil para nuevas construcciones o cuando no hay baseline real.",
    typical_use: [
      "Edificaciones nuevas",
      "Remodelaciones mayores",
      "Cuando no hay datos históricos",
    ],
    accuracy: "Variable (depende de la calibración)",
    cost: "Alto",
    formula: {
      name: "Ahorros Opción D",
      description: "Ahorros = (Simulación baseline calibrada) - (Simulación post-retrofit o medición real)",
      formula: "Ahorros = E_simulado_base - E_simulado_post (o E_medido_post)",
      reference: {
        code: "IPMVP-D",
        standard: "IPMVP Core Concepts 2022",
        section: "Chapter 9 — Option D: Calibrated Simulation",
        year: 2022,
        organization: "EVO",
        url: "https://evo-world.org/en/products-services-mainmenu-en/protocols/ipmvp",
      },
    } satisfies StandardFormula,
  },
} as const;

/**
 * Fórmula fundamental de ahorros según IPMVP.
 */
export const SAVINGS_FORMULA: StandardFormula = {
  name: "Fórmula fundamental de ahorros (IPMVP)",
  description:
    "Ahorros = Energía del Periodo Base - Energía del Periodo de Reporte ± Ajustes. " +
    "Los ajustes corrigen variaciones rutinarias (clima, producción) y no rutinarias (cambios de proceso).",
  formula: "Ahorros = E_base - E_reporte ± Ajustes_rutinarios ± Ajustes_no_rutinarios",
  reference: {
    code: "IPMVP-FUND",
    standard: "IPMVP Core Concepts 2022",
    section: "Chapter 4 — Key M&V Concepts, Savings determination",
    year: 2022,
    organization: "EVO",
    url: "https://evo-world.org/en/products-services-mainmenu-en/protocols/ipmvp",
  },
};
