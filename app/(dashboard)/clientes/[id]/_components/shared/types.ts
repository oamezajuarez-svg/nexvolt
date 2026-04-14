export const sections = [
  { id: "overview", label: "Resumen" },
  { id: "plant", label: "Perfil de Planta" },
  { id: "cfe", label: "Recibos CFE" },
  { id: "equipment", label: "Inventario de Equipos" },
  { id: "balance", label: "Balance Energetico" },
  { id: "anomalies", label: "Anomalias y Diagnostico" },
  { id: "solutions", label: "Soluciones y ROI" },
  { id: "monitoring", label: "Monitoreo en Tiempo Real" },
  { id: "certifications", label: "Certificaciones y Beneficios" },
  { id: "simulator", label: "Simulador de Ahorro" },
] as const;
export type SectionId = (typeof sections)[number]["id"];
