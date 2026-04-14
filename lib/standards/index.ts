/**
 * NexVolt Standards Library
 *
 * All thresholds, formulas, and parameters are sourced from recognized
 * standards and Mexican regulations. Each constant includes its reference.
 *
 * Standards integrated:
 * - CFE / CRE — Tarifas, factor de potencia, demanda
 * - NOM-001-SEDE-2012 — Instalaciones eléctricas
 * - IEEE 519-2022 — Límites de distorsión armónica
 * - SEMARNAT — Factor de emisión del SEN
 * - CONUEE — Lineamientos de eficiencia energética
 * - ASHRAE 90.1-2022 — Eficiencia energética en edificaciones
 * - ASHRAE Guideline 14 — Medición y verificación (M&V)
 * - IPMVP — Protocolo de M&V
 * - LEED v4.1 — Créditos de energía y emisiones
 * - NOM-025-STPS-2008 — Iluminación en centros de trabajo
 */

export * from "./cfe-cre";
export * from "./nom-ieee";
export * from "./emissions";
export * from "./efficiency";
export * from "./mv-protocol";
export * from "./leed";
export * from "./illumination";
export * from "./types";
