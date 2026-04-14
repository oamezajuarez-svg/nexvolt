import type { StandardThreshold } from "./types";

// ============================================================
// SEMARNAT — Factor de Emisión del SEN
// ============================================================

/**
 * Factor de emisión del Sistema Eléctrico Nacional (SEN).
 * Publicado anualmente por SEMARNAT con datos de CRE.
 * Se usa para calcular emisiones indirectas de CO2 por consumo eléctrico.
 *
 * Histórico:
 *   2020: 0.423 tCO2e/MWh
 *   2021: 0.431 tCO2e/MWh
 *   2022: 0.435 tCO2e/MWh
 *   2023: 0.438 tCO2e/MWh
 *   2024: 0.444 tCO2e/MWh (último publicado)
 */
export const EMISSION_FACTORS = {
  /** Factor de emisión vigente (2024) */
  sen_current: {
    value: 0.444,
    unit: "tCO2e/MWh",
    description: "Factor de emisión del SEN 2024 — para cálculo de emisiones indirectas Alcance 2",
    reference: {
      code: "SEMARNAT-FE-2024",
      standard: "Aviso del Factor de Emisión del Sistema Eléctrico Nacional",
      section: "Factor de emisión eléctrico 2024",
      year: 2024,
      organization: "SEMARNAT / CRE",
      url: "https://www.gob.mx/cms/uploads/attachment/file/895937/Aviso_FE-SEN23.pdf",
    },
  } satisfies StandardThreshold,

  /** Factor 2023 (para comparaciones históricas) */
  sen_2023: {
    value: 0.438,
    unit: "tCO2e/MWh",
    description: "Factor de emisión del SEN 2023",
    reference: {
      code: "SEMARNAT-FE-2023",
      standard: "Aviso del Factor de Emisión del Sistema Eléctrico Nacional",
      section: "Factor de emisión eléctrico 2023",
      year: 2023,
      organization: "SEMARNAT / CRE",
    },
  } satisfies StandardThreshold,

  /** Factor 2022 */
  sen_2022: {
    value: 0.435,
    unit: "tCO2e/MWh",
    description: "Factor de emisión del SEN 2022",
    reference: {
      code: "SEMARNAT-FE-2022",
      standard: "Aviso del Factor de Emisión del Sistema Eléctrico Nacional",
      section: "Factor de emisión eléctrico 2022",
      year: 2022,
      organization: "SEMARNAT / CRE",
      url: "https://www.gob.mx/cms/uploads/attachment/file/806468/4_-Aviso_FE_2022__1_.pdf",
    },
  } satisfies StandardThreshold,
};

/**
 * Factores de emisión para combustibles (Scope 1).
 * Ref: SEMARNAT / IPCC 2006 Guidelines.
 */
export const FUEL_EMISSION_FACTORS = {
  /** Gas natural */
  natural_gas: {
    value: 0.05603,
    unit: "tCO2/GJ",
    description: "Factor de emisión para gas natural",
    reference: {
      code: "IPCC-GN",
      standard: "IPCC 2006 Guidelines for National Greenhouse Gas Inventories",
      section: "Vol. 2, Table 2.2 — Default emission factors",
      year: 2006,
      organization: "IPCC / SEMARNAT",
    },
  } satisfies StandardThreshold,

  /** Diésel */
  diesel: {
    value: 0.07404,
    unit: "tCO2/GJ",
    description: "Factor de emisión para diésel",
    reference: {
      code: "IPCC-DIESEL",
      standard: "IPCC 2006 Guidelines for National Greenhouse Gas Inventories",
      section: "Vol. 2, Table 2.2",
      year: 2006,
      organization: "IPCC / SEMARNAT",
    },
  } satisfies StandardThreshold,

  /** Gas LP */
  lpg: {
    value: 0.06312,
    unit: "tCO2/GJ",
    description: "Factor de emisión para gas LP",
    reference: {
      code: "IPCC-GLP",
      standard: "IPCC 2006 Guidelines for National Greenhouse Gas Inventories",
      section: "Vol. 2, Table 2.2",
      year: 2006,
      organization: "IPCC / SEMARNAT",
    },
  } satisfies StandardThreshold,
};

// ============================================================
// GHG Calculations
// ============================================================

/**
 * Calcula emisiones de CO2 por consumo eléctrico (Alcance 2).
 * @param consumptionMWh — Consumo eléctrico en MWh
 * @param year — Año para seleccionar el factor de emisión (default: vigente)
 */
export function calculateElectricEmissions(
  consumptionMWh: number,
  year?: number
): { tCO2e: number; factor: StandardThreshold } {
  let factor: StandardThreshold = EMISSION_FACTORS.sen_current;
  if (year === 2023) factor = EMISSION_FACTORS.sen_2023;
  if (year === 2022) factor = EMISSION_FACTORS.sen_2022;

  return {
    tCO2e: consumptionMWh * factor.value,
    factor,
  };
}

/**
 * Calcula reducción de CO2 por ahorro energético.
 */
export function calculateCO2Reduction(
  savingsKwh: number
): { tCO2e: number; factor: StandardThreshold } {
  const factor = EMISSION_FACTORS.sen_current;
  return {
    tCO2e: (savingsKwh / 1000) * factor.value,
    factor,
  };
}

// ============================================================
// RENE — Registro Nacional de Emisiones
// ============================================================

/**
 * Umbrales para reporte obligatorio al RENE (SEMARNAT).
 * Las empresas que emiten ≥25,000 tCO2e/año deben reportar.
 */
export const RENE_THRESHOLDS = {
  mandatory_reporting: {
    value: 25_000,
    unit: "tCO2e/año",
    description: "Umbral de emisiones para reporte obligatorio al Registro Nacional de Emisiones",
    reference: {
      code: "RENE-UMBRAL",
      standard: "Ley General de Cambio Climático / Reglamento del RENE",
      section: "Art. 87 — Umbrales de reporte",
      year: 2014,
      organization: "SEMARNAT",
      url: "https://www.gob.mx/semarnat/acciones-y-programas/registro-nacional-de-emisiones-rene",
    },
  } satisfies StandardThreshold,
};
