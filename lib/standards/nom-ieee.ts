import type { StandardThreshold } from "./types";

// ============================================================
// NOM-001-SEDE-2012 — Instalaciones Eléctricas
// ============================================================

/**
 * Límites de voltaje según NOM-001-SEDE-2012 y CFE.
 * El voltaje de suministro debe mantenerse dentro de ±10% del nominal.
 */
export const VOLTAGE_LIMITS = {
  /** Tolerancia de voltaje respecto al nominal */
  tolerance_pct: {
    value: 10,
    unit: "%",
    description: "Variación máxima permitida de voltaje respecto al nominal (±10%)",
    reference: {
      code: "NOM-SEDE-VOLT",
      standard: "NOM-001-SEDE-2012",
      section: "Art. 210-3 — Tensiones nominales de circuitos",
      year: 2012,
      organization: "Secretaría de Economía / ANCE",
    },
  } satisfies StandardThreshold,

  /** Voltaje nominal estándar en baja tensión (fase-fase) */
  nominal_lt_220: {
    value: 220,
    unit: "V",
    description: "Voltaje nominal fase-fase en baja tensión",
    reference: {
      code: "NOM-SEDE-220",
      standard: "NOM-001-SEDE-2012",
      section: "Tabla 210-1 — Tensiones nominales",
      year: 2012,
      organization: "Secretaría de Economía / ANCE",
    },
  } satisfies StandardThreshold,

  /** Voltaje nominal en media tensión */
  nominal_mt_23kv: {
    value: 23_000,
    unit: "V",
    description: "Voltaje nominal en media tensión (23 kV)",
    reference: {
      code: "NOM-SEDE-23K",
      standard: "NOM-001-SEDE-2012",
      section: "Tabla 210-1",
      year: 2012,
      organization: "Secretaría de Economía / ANCE",
    },
  } satisfies StandardThreshold,
};

/**
 * Desbalance de voltaje entre fases.
 * NOM-001-SEDE establece máximo 3% de desbalance.
 * NEMA MG-1 recomienda no operar motores con >5% de desbalance.
 */
export const VOLTAGE_IMBALANCE = {
  /** Máximo desbalance de voltaje permitido */
  max_pct: {
    value: 3,
    unit: "%",
    description: "Desbalance máximo de voltaje entre fases",
    reference: {
      code: "NOM-SEDE-DESB",
      standard: "NOM-001-SEDE-2012 / NEMA MG-1",
      section: "Art. 430 — Motores, desbalance de tensión",
      year: 2012,
      organization: "Secretaría de Economía / NEMA",
    },
  } satisfies StandardThreshold,

  /** Umbral crítico (desenergizar motores) */
  critical_pct: {
    value: 5,
    unit: "%",
    description: "Desbalance que causa daño a motores — se recomienda desenergizar",
    reference: {
      code: "NEMA-MG1-DESB",
      standard: "NEMA MG-1",
      section: "Parte 14 — Motores de inducción, desbalance de voltaje",
      year: 2016,
      organization: "NEMA",
    },
  } satisfies StandardThreshold,
};

// ============================================================
// IEEE 519-2022 — Distorsión Armónica
// ============================================================

/**
 * Límites de distorsión armónica de voltaje (THDv) según IEEE 519-2022.
 * Los límites varían por nivel de tensión.
 */
export const HARMONIC_VOLTAGE_LIMITS = {
  /** Baja tensión (≤1 kV) */
  low_voltage: {
    individual_max_pct: 5.0,
    thd_max_pct: 8.0,
    voltage_range: "≤ 1 kV",
    reference: {
      code: "IEEE-519-LV",
      standard: "IEEE 519-2022",
      section: "Table 1 — Voltage distortion limits",
      year: 2022,
      organization: "IEEE",
      url: "https://standards.ieee.org/ieee/519/10677/",
    },
  },

  /** Media tensión (1 kV < V ≤ 69 kV) */
  medium_voltage: {
    individual_max_pct: 3.0,
    thd_max_pct: 5.0,
    voltage_range: "1 kV < V ≤ 69 kV",
    reference: {
      code: "IEEE-519-MV",
      standard: "IEEE 519-2022",
      section: "Table 1 — Voltage distortion limits",
      year: 2022,
      organization: "IEEE",
      url: "https://standards.ieee.org/ieee/519/10677/",
    },
  },

  /** Alta tensión (69 kV < V ≤ 161 kV) */
  high_voltage: {
    individual_max_pct: 1.5,
    thd_max_pct: 2.5,
    voltage_range: "69 kV < V ≤ 161 kV",
    reference: {
      code: "IEEE-519-HV",
      standard: "IEEE 519-2022",
      section: "Table 1 — Voltage distortion limits",
      year: 2022,
      organization: "IEEE",
      url: "https://standards.ieee.org/ieee/519/10677/",
    },
  },

  /** Extra alta tensión (> 161 kV) */
  extra_high_voltage: {
    individual_max_pct: 1.0,
    thd_max_pct: 1.5,
    voltage_range: "> 161 kV",
    reference: {
      code: "IEEE-519-EHV",
      standard: "IEEE 519-2022",
      section: "Table 1 — Voltage distortion limits",
      year: 2022,
      organization: "IEEE",
      url: "https://standards.ieee.org/ieee/519/10677/",
    },
  },
};

/**
 * Límites de distorsión armónica de corriente (TDD) según IEEE 519-2022.
 * Depende del ratio Isc/IL (corriente de cortocircuito / demanda máxima).
 *
 * Para la mayoría de instalaciones industriales: Isc/IL entre 20 y 50.
 */
export const HARMONIC_CURRENT_LIMITS = {
  /** Rango típico industrial: Isc/IL 20-50 */
  typical_industrial: {
    isc_il_range: "20 < Isc/IL ≤ 50",
    tdd_max_pct: 8.0,
    odd_harmonics: {
      h3_h11: 7.0,
      h13_h23: 3.5,
      h25_h35: 2.5,
    },
    reference: {
      code: "IEEE-519-TDD",
      standard: "IEEE 519-2022",
      section: "Table 2 — Current distortion limits for systems rated 120V–69kV",
      year: 2022,
      organization: "IEEE",
      url: "https://standards.ieee.org/ieee/519/10677/",
    },
  },

  /** Instalaciones débiles: Isc/IL < 20 */
  weak_system: {
    isc_il_range: "Isc/IL < 20",
    tdd_max_pct: 5.0,
    odd_harmonics: {
      h3_h11: 4.0,
      h13_h23: 2.0,
      h25_h35: 1.5,
    },
    reference: {
      code: "IEEE-519-TDD-WEAK",
      standard: "IEEE 519-2022",
      section: "Table 2 — Current distortion limits",
      year: 2022,
      organization: "IEEE",
    },
  },
};

/**
 * Evalúa si los niveles de THD están dentro de norma.
 */
export function evaluateHarmonicCompliance(
  thdVoltage: number,
  voltageLevel: "low_voltage" | "medium_voltage" | "high_voltage" | "extra_high_voltage"
): { compliant: boolean; limit: number; measured: number; standard: string } {
  const limit = HARMONIC_VOLTAGE_LIMITS[voltageLevel];
  return {
    compliant: thdVoltage <= limit.thd_max_pct,
    limit: limit.thd_max_pct,
    measured: thdVoltage,
    standard: `${limit.reference.standard} — ${limit.reference.section}`,
  };
}
