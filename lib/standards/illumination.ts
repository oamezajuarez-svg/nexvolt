import type { StandardThreshold } from "./types";

// ============================================================
// NOM-025-STPS-2008 — Iluminación en Centros de Trabajo
// ============================================================

/**
 * Niveles mínimos de iluminación por tipo de área/actividad.
 * Ref: NOM-025-STPS-2008, Tabla 1.
 */
export const ILLUMINATION_LEVELS: Record<string, StandardThreshold> = {
  /** Exteriores generales */
  exterior_general: {
    value: 20,
    unit: "lux",
    description: "Exteriores generales: patios, estacionamientos",
    reference: {
      code: "NOM-025-EXT",
      standard: "NOM-025-STPS-2008",
      section: "Tabla 1 — Niveles de iluminación",
      year: 2008,
      organization: "STPS",
    },
  },

  /** Pasillos, escaleras, bodegas (baja exigencia visual) */
  corridors_storage: {
    value: 100,
    unit: "lux",
    description: "Pasillos, escaleras, estacionamientos cubiertos, bodegas",
    reference: {
      code: "NOM-025-PAS",
      standard: "NOM-025-STPS-2008",
      section: "Tabla 1",
      year: 2008,
      organization: "STPS",
    },
  },

  /** Trabajo en máquinas / ensamble general */
  machine_work: {
    value: 300,
    unit: "lux",
    description: "Áreas de producción, trabajo con maquinaria, ensamble general",
    reference: {
      code: "NOM-025-MAQ",
      standard: "NOM-025-STPS-2008",
      section: "Tabla 1",
      year: 2008,
      organization: "STPS",
    },
  },

  /** Oficinas y salas de reuniones */
  offices: {
    value: 300,
    unit: "lux",
    description: "Oficinas generales, salas de juntas, áreas administrativas",
    reference: {
      code: "NOM-025-OFC",
      standard: "NOM-025-STPS-2008",
      section: "Tabla 1",
      year: 2008,
      organization: "STPS",
    },
  },

  /** Trabajo de detalle / inspección */
  detail_work: {
    value: 500,
    unit: "lux",
    description: "Trabajo de detalle, inspección, laboratorio, salas de dibujo",
    reference: {
      code: "NOM-025-DET",
      standard: "NOM-025-STPS-2008",
      section: "Tabla 1",
      year: 2008,
      organization: "STPS",
    },
  },

  /** Trabajo de alta precisión */
  precision_work: {
    value: 750,
    unit: "lux",
    description: "Trabajo de alta precisión, ensamble electrónico, joyería",
    reference: {
      code: "NOM-025-PREC",
      standard: "NOM-025-STPS-2008",
      section: "Tabla 1",
      year: 2008,
      organization: "STPS",
    },
  },

  /** Trabajo de muy alta precisión */
  ultra_precision: {
    value: 1000,
    unit: "lux",
    description: "Trabajo de muy alta precisión, salas de cirugía, relojería",
    reference: {
      code: "NOM-025-ULTRA",
      standard: "NOM-025-STPS-2008",
      section: "Tabla 1",
      year: 2008,
      organization: "STPS",
    },
  },
};

/**
 * Densidad de potencia de iluminación (LPD) de referencia.
 * ASHRAE 90.1-2022, Tabla 9.5.1.
 * Se usa para evaluar eficiencia del sistema de iluminación.
 */
export const LIGHTING_POWER_DENSITY: Record<string, {
  ashrae_max: number;
  efficient_target: number;
  unit: string;
  building_type: string;
}> = {
  office: {
    ashrae_max: 8.8,
    efficient_target: 6.0,
    unit: "W/m²",
    building_type: "Oficinas",
  },
  retail: {
    ashrae_max: 12.5,
    efficient_target: 8.5,
    unit: "W/m²",
    building_type: "Comercial / Retail",
  },
  warehouse: {
    ashrae_max: 6.6,
    efficient_target: 4.0,
    unit: "W/m²",
    building_type: "Bodega / Almacén",
  },
  manufacturing: {
    ashrae_max: 11.8,
    efficient_target: 7.5,
    unit: "W/m²",
    building_type: "Manufactura",
  },
  hotel: {
    ashrae_max: 9.7,
    efficient_target: 6.5,
    unit: "W/m²",
    building_type: "Hotel",
  },
  hospital: {
    ashrae_max: 10.8,
    efficient_target: 7.5,
    unit: "W/m²",
    building_type: "Hospital",
  },
  school: {
    ashrae_max: 9.7,
    efficient_target: 6.5,
    unit: "W/m²",
    building_type: "Escuela",
  },
  parking: {
    ashrae_max: 2.4,
    efficient_target: 1.5,
    unit: "W/m²",
    building_type: "Estacionamiento",
  },
};
