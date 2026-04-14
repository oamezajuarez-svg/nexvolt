import type { PlantProfile } from "./types";

export const mockPlantProfile: PlantProfile = {
  total_area_m2: 4200,
  production_area_m2: 3000,
  office_area_m2: 800,
  warehouse_area_m2: 400,
  shifts_per_day: 2,
  hours_per_shift: 10,
  days_per_week: 6,
  operating_days_per_year: 300,
  production_volume: 1200,
  production_unit: "toneladas",
  process_description:
    "Manufactura de piezas metálicas industriales. Proceso incluye corte, soldadura, " +
    "maquinado CNC, tratamiento térmico, pintura y empaque. Dos líneas de producción " +
    "principales con capacidad de 4 toneladas/día por línea.",
  transformer_capacity_kva: 500,
  transformer_count: 1,
  voltage_level: "220V trifásico",
  substation_count: 1,
  has_generator: true,
  generator_capacity_kva: 150,
};
