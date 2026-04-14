import type { StandardThreshold } from "./types";

// ============================================================
// ASHRAE 90.1-2022 — Eficiencia Energética
// ============================================================

/**
 * Indicadores de eficiencia energética según ASHRAE 90.1-2022.
 * Estos valores sirven como baseline para calcular % de mejora.
 */
export const ASHRAE_EFFICIENCY = {
  /**
   * Reducción energética del 2022 vs 2019
   * DOE determinó 9.8% de ahorro nacional promedio.
   */
  improvement_vs_2019: {
    value: 9.8,
    unit: "%",
    description: "Ahorro energético promedio de ASHRAE 90.1-2022 vs 2019",
    reference: {
      code: "ASHRAE-901-IMP",
      standard: "ANSI/ASHRAE/IES Standard 90.1-2022",
      section: "DOE Determination — Energy savings analysis",
      year: 2022,
      organization: "ASHRAE / DOE",
      url: "https://www.federalregister.gov/documents/2024/03/06/2024-04717/determination-regarding-energy-efficiency-improvements-in-ansiashraeies-standard-901-2022",
    },
  } satisfies StandardThreshold,

  /**
   * Reducción acumulada vs ASHRAE 90.1-2004 (baseline LEED)
   */
  improvement_vs_2004: {
    value: 48,
    unit: "%",
    description: "Reducción de costos energéticos de ASHRAE 90.1-2022 vs 2004",
    reference: {
      code: "ASHRAE-901-2004",
      standard: "ANSI/ASHRAE/IES Standard 90.1-2022",
      section: "DOE Cost comparison vs 2004 baseline",
      year: 2022,
      organization: "ASHRAE / DOE",
    },
  } satisfies StandardThreshold,

  /** Eficiencia mínima de transformadores (DOE 2016 / ASHRAE 90.1) */
  transformer_min_efficiency: {
    value: 98.0,
    unit: "%",
    description: "Eficiencia mínima para transformadores secos de distribución (≥150 kVA)",
    reference: {
      code: "ASHRAE-XFMR",
      standard: "ANSI/ASHRAE/IES Standard 90.1-2022",
      section: "Section 8 — Power, Table 8.1 Transformer efficiency",
      year: 2022,
      organization: "ASHRAE",
    },
  } satisfies StandardThreshold,

  /** Eficiencia mínima de motores (NEMA Premium / IE3+) */
  motor_min_efficiency: {
    value: 95.4,
    unit: "%",
    description: "Eficiencia mínima para motores ≥50 HP (NEMA Premium / IE3)",
    reference: {
      code: "ASHRAE-MOTOR",
      standard: "ANSI/ASHRAE/IES Standard 90.1-2022 / NEMA MG-1",
      section: "Section 10 — Other equipment, motor efficiency tables",
      year: 2022,
      organization: "ASHRAE / NEMA",
    },
  } satisfies StandardThreshold,
};

// ============================================================
// CONUEE — Eficiencia Energética en México
// ============================================================

/**
 * Lineamientos CONUEE para diagnósticos energéticos.
 * Estructura del reporte de diagnóstico energético.
 */
export const CONUEE_DIAGNOSTIC_SECTIONS = [
  {
    number: 1,
    title: "Datos generales de la empresa",
    description: "Razón social, RFC, giro industrial, ubicación, tamaño, contacto",
  },
  {
    number: 2,
    title: "Descripción del proceso productivo",
    description: "Diagrama de proceso, equipos principales, horarios de operación",
  },
  {
    number: 3,
    title: "Información energética histórica",
    description: "Consumos y costos de energía de los últimos 12-24 meses por tipo de energético",
  },
  {
    number: 4,
    title: "Balance energético",
    description: "Distribución del consumo por sistema/área: motriz, iluminación, HVAC, procesos, otros",
  },
  {
    number: 5,
    title: "Indicadores energéticos",
    description: "Consumo específico (kWh/unidad producida), intensidad energética, baseline",
  },
  {
    number: 6,
    title: "Identificación de oportunidades de ahorro",
    description: "Listado de medidas con análisis técnico: descripción, ahorro estimado, inversión",
  },
  {
    number: 7,
    title: "Análisis económico de las medidas",
    description: "Inversión, ahorro anual, periodo de recuperación simple, TIR, VPN",
  },
  {
    number: 8,
    title: "Plan de implementación",
    description: "Priorización de medidas, cronograma, responsables, recursos necesarios",
  },
  {
    number: 9,
    title: "Conclusiones y recomendaciones",
    description: "Resumen ejecutivo de hallazgos y plan de acción propuesto",
  },
];

/**
 * Umbrales CONUEE para clasificación de usuarios de alto consumo (UPAC).
 * Los UPAC deben reportar anualmente a CONUEE.
 */
export const CONUEE_UPAC = {
  /** Umbral para sector industrial */
  industrial_threshold: {
    value: 1_000,
    unit: "bep/año (barriles equivalentes de petróleo)",
    description: "Umbral de consumo para clasificación como Usuario de Patrón de Alto Consumo — Industrial",
    reference: {
      code: "CONUEE-UPAC-IND",
      standard: "Ley para el Aprovechamiento Sustentable de la Energía / Lineamientos CONUEE",
      section: "Artículo 7, fracción VII — Clasificación UPAC",
      year: 2022,
      organization: "CONUEE",
      url: "https://www.gob.mx/conuee/acciones-y-programas/disposiciones-administrativas-y-lineamientos-empresas-energeticas-205903",
    },
  } satisfies StandardThreshold,
};

/**
 * Indicadores de intensidad energética por sector industrial.
 * Valores de referencia para benchmarking (CONUEE / SENER).
 */
export const ENERGY_INTENSITY_BENCHMARKS: Record<string, {
  typical: number;
  efficient: number;
  unit: string;
  sector: string;
}> = {
  manufacturing_general: {
    typical: 2.5,
    efficient: 1.8,
    unit: "MJ/MXN de producción",
    sector: "Manufactura general",
  },
  food_processing: {
    typical: 3.2,
    efficient: 2.1,
    unit: "MJ/kg producido",
    sector: "Procesamiento de alimentos",
  },
  cement: {
    typical: 4.5,
    efficient: 3.2,
    unit: "GJ/tonelada",
    sector: "Cemento",
  },
  steel: {
    typical: 20,
    efficient: 14,
    unit: "GJ/tonelada",
    sector: "Acero",
  },
  plastics: {
    typical: 8.5,
    efficient: 5.5,
    unit: "MJ/kg",
    sector: "Plásticos",
  },
  hotel: {
    typical: 450,
    efficient: 280,
    unit: "kWh/m²/año",
    sector: "Hotelería",
  },
  agriculture_irrigation: {
    typical: 1.8,
    efficient: 1.2,
    unit: "kWh/m³ de agua",
    sector: "Riego agrícola",
  },
};
