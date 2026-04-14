/** Metadata for every standard-backed value in the system */
export interface StandardReference {
  /** Short code (e.g. "CFE-FP", "IEEE-519") */
  code: string;
  /** Full standard name */
  standard: string;
  /** Specific article, table, or section */
  section: string;
  /** Year of the referenced edition */
  year: number;
  /** Issuing organization */
  organization: string;
  /** URL to official document (when publicly available) */
  url?: string;
}

/** A threshold value backed by a standard */
export interface StandardThreshold {
  value: number;
  unit: string;
  description: string;
  reference: StandardReference;
}

/** A formula backed by a standard */
export interface StandardFormula {
  name: string;
  description: string;
  /** Human-readable formula string */
  formula: string;
  reference: StandardReference;
}

/** Tariff period classification */
export type TariffPeriod = "base" | "intermedia" | "punta";

/** CFE tariff type */
export type CFETariff =
  | "GDMTH"  // Gran Demanda Media Tensión Horaria (≥100 kW)
  | "GDMTO"  // Gran Demanda Media Tensión Ordinaria (<100 kW)
  | "DIST"   // Distribución
  | "DIT"    // Gran Demanda Alta Tensión
  | "PDBT"   // Pequeña Demanda Baja Tensión
  | "RABT"   // Riego Agrícola Baja Tensión
  | "RAMT";  // Riego Agrícola Media Tensión
