import type {
  ClientDetail,
  AuditProgress,
  CertificationReadiness,
  CertificationItem,
  FiscalBenefit,
  EnvironmentalMetric,
  ProposedSolution,
  CFEInvoice,
} from "../types";
import { EMISSION_FACTORS } from "../standards/emissions";
import { CONUEE_DIAGNOSTIC_SECTIONS } from "../standards/efficiency";

// ─── Progreso de auditoría ───

/**
 * Calcula el progreso de auditoría basado en los datos disponibles del cliente.
 * Mapea directamente a las secciones del diagnóstico energético CONUEE.
 */
export function calculateAuditProgress(client: ClientDetail): AuditProgress {
  const steps = [
    {
      id: "info",
      label: "Datos del cliente",
      status: (client.name && client.rfc && client.contact_name) ? "complete" as const : "partial" as const,
      pct: (client.name ? 25 : 0) + (client.rfc ? 25 : 0) + (client.contact_name ? 25 : 0) + (client.contact_email ? 25 : 0),
    },
    {
      id: "plant",
      label: "Perfil de planta",
      status: client.plant_profile ? "complete" as const : "pending" as const,
      pct: client.plant_profile ? 100 : 0,
    },
    {
      id: "invoices",
      label: "Recibos CFE (12 meses)",
      status: client.invoices.length >= 12 ? "complete" as const
        : client.invoices.length > 0 ? "partial" as const
        : "pending" as const,
      pct: Math.min(100, Math.round((client.invoices.length / 12) * 100)),
    },
    {
      id: "equipment",
      label: "Inventario de equipos",
      status: (client.equipment && client.equipment.length >= 15) ? "complete" as const
        : (client.equipment && client.equipment.length > 0) ? "partial" as const
        : "pending" as const,
      pct: client.equipment
        ? Math.min(100, Math.round((client.equipment.length / 20) * 100))
        : 0,
    },
    {
      id: "analysis",
      label: "Análisis y diagnóstico",
      status: (client.anomalies.length > 0 && client.proposed_solutions.length > 0) ? "complete" as const
        : (client.anomalies.length > 0 || client.proposed_solutions.length > 0) ? "partial" as const
        : "pending" as const,
      pct: Math.min(100,
        (client.anomalies.length > 0 ? 50 : 0) +
        (client.proposed_solutions.length > 0 ? 50 : 0)
      ),
    },
    {
      id: "report",
      label: "Reporte generado",
      status: "pending" as const, // Siempre pendiente hasta que se genere
      pct: 0,
    },
  ];

  const overall = Math.round(steps.reduce((sum, s) => sum + s.pct, 0) / steps.length);

  return { client_id: client.id, steps, overall_pct: overall };
}

// ─── Certificaciones ───

/**
 * Evalúa el nivel de preparación para certificaciones basado en los datos del cliente.
 * Cada certificación mapea a requisitos específicos de datos.
 */
export function calculateCertificationReadiness(client: ClientDetail): CertificationReadiness {
  const hasInvoices = client.invoices.length >= 12;
  const hasEquipment = (client.equipment?.length || 0) > 0;
  const hasPlant = !!client.plant_profile;
  const hasAnomalies = client.anomalies.length > 0;
  const hasSolutions = client.proposed_solutions.length > 0;
  const hasMonitoring = client.monitoring_devices.length > 0;

  // CONUEE — mapea a las 9 secciones del diagnóstico energético
  const conueeItems: CertificationItem[] = CONUEE_DIAGNOSTIC_SECTIONS.map((section) => {
    switch (section.number) {
      case 1: return { label: section.title, met: !!(client.name && client.rfc), source: "Datos del cliente" };
      case 2: return { label: section.title, met: hasPlant, source: "Perfil de planta" };
      case 3: return { label: section.title, met: hasInvoices, source: "12 recibos CFE" };
      case 4: return { label: section.title, met: hasEquipment, source: "Inventario de equipos" };
      case 5: return { label: section.title, met: hasInvoices && hasPlant, source: "Recibos + Perfil planta" };
      case 6: return { label: section.title, met: hasAnomalies, source: "Análisis de anomalías" };
      case 7: return { label: section.title, met: hasSolutions, source: "Soluciones propuestas" };
      case 8: return { label: section.title, met: hasSolutions, source: "Plan de implementación" };
      case 9: return { label: section.title, met: hasAnomalies && hasSolutions, source: "Diagnóstico completo" };
      default: return { label: section.title, met: false, source: "N/A" };
    }
  });

  const conueePct = Math.round((conueeItems.filter((i) => i.met).length / conueeItems.length) * 100);

  // LEED v4.1 EA — créditos de energía
  const leedItems: CertificationItem[] = [
    { label: "Baseline energético (12 meses)", met: hasInvoices, source: "Recibos CFE" },
    { label: "Inventario de sistemas energéticos", met: hasEquipment, source: "Inventario de equipos" },
    { label: "Modelo de rendimiento energético", met: hasInvoices && hasEquipment, source: "Recibos + Equipos" },
    { label: "Estrategias de reducción identificadas", met: hasSolutions, source: "Soluciones propuestas" },
    { label: "Medición y verificación (M&V)", met: hasMonitoring, source: "Monitoreo en tiempo real" },
    { label: "Comisionamiento de sistemas", met: false, source: "Requiere verificación en sitio" },
  ];
  const leedPct = Math.round((leedItems.filter((i) => i.met).length / leedItems.length) * 100);

  // ISO 50001 — Sistema de Gestión de Energía
  const iso50001Items: CertificationItem[] = [
    { label: "Política energética definida", met: false, source: "Documento de política" },
    { label: "Línea base energética establecida", met: hasInvoices, source: "12 meses de recibos CFE" },
    { label: "Usos significativos de energía (USE)", met: hasEquipment, source: "Inventario de equipos" },
    { label: "Indicadores de desempeño (EnPI)", met: hasInvoices && hasPlant, source: "Intensidad energética" },
    { label: "Monitoreo continuo", met: hasMonitoring, source: "Dispositivos IoT" },
    { label: "Objetivos y metas energéticas", met: hasSolutions, source: "Soluciones y ROI" },
    { label: "Revisión por la dirección", met: false, source: "Proceso organizacional" },
    { label: "Auditoría interna", met: false, source: "Proceso organizacional" },
  ];
  const iso50001Pct = Math.round((iso50001Items.filter((i) => i.met).length / iso50001Items.length) * 100);

  return {
    conuee_pct: conueePct,
    leed_pct: leedPct,
    iso50001_pct: iso50001Pct,
    conuee_items: conueeItems,
    leed_items: leedItems,
    iso50001_items: iso50001Items,
  };
}

// ─── Beneficios fiscales ───

/**
 * Calcula beneficios fiscales potenciales basados en las soluciones propuestas.
 * Ref: Art. 34 LISR — Deducción de inversiones en eficiencia energética.
 */
export function calculateFiscalBenefits(solutions: ProposedSolution[]): FiscalBenefit[] {
  const benefits: FiscalBenefit[] = [];

  const totalInvestment = solutions.reduce((sum, s) => sum + s.investment, 0);
  const hasSolar = solutions.some((s) => s.type === "solar_pv");
  const hasBESS = solutions.some((s) => s.type === "bess");
  const hasEfficiency = solutions.some((s) =>
    ["capacitor_bank", "vfd", "led"].includes(s.type)
  );

  if (hasEfficiency) {
    const effInvestment = solutions
      .filter((s) => ["capacitor_bank", "vfd", "led"].includes(s.type))
      .reduce((sum, s) => sum + s.investment, 0);

    benefits.push({
      id: "lisr-34",
      name: "Deducción fiscal por eficiencia energética",
      description:
        "Las inversiones en equipos de eficiencia energética pueden deducirse de " +
        "forma acelerada conforme al Art. 34 LISR. Depreciación hasta 100% en primer año " +
        "para equipos que generen eficiencia energética.",
      estimated_value_mxn: Math.round(effInvestment * 0.3), // ~30% tasa ISR
      legal_reference: "Art. 34, fracción XIII, Ley del Impuesto Sobre la Renta (LISR)",
      applicable: true,
    });
  }

  if (hasSolar) {
    const solarInvestment = solutions
      .filter((s) => s.type === "solar_pv")
      .reduce((sum, s) => sum + s.investment, 0);

    benefits.push({
      id: "lisr-34-solar",
      name: "Depreciación acelerada — energía solar",
      description:
        "Los equipos de generación de energía a partir de fuentes renovables se " +
        "deprecian al 100% en el primer año fiscal. Aplica a paneles solares, inversores " +
        "y estructura de montaje.",
      estimated_value_mxn: Math.round(solarInvestment * 0.3),
      legal_reference: "Art. 34, fracción XIII, LISR — Equipos de generación renovable",
      applicable: true,
    });

    benefits.push({
      id: "cels",
      name: "Certificados de Energía Limpia (CELs)",
      description:
        "La generación con energía solar genera Certificados de Energía Limpia que " +
        "pueden venderse o usarse para cumplir con la obligación de CELs de la " +
        "Ley de la Industria Eléctrica.",
      estimated_value_mxn: Math.round(solarInvestment * 0.05), // Estimación conservadora
      legal_reference: "Art. 123, Ley de la Industria Eléctrica — Certificados de Energía Limpia",
      applicable: true,
    });
  }

  if (hasBESS) {
    benefits.push({
      id: "lisr-34-bess",
      name: "Depreciación acelerada — almacenamiento de energía",
      description:
        "Los sistemas de almacenamiento de energía que complementen fuentes renovables " +
        "pueden acceder a depreciación acelerada.",
      estimated_value_mxn: Math.round(
        solutions.filter((s) => s.type === "bess").reduce((sum, s) => sum + s.investment, 0) * 0.3
      ),
      legal_reference: "Art. 34, LISR — Equipos complementarios de generación limpia",
      applicable: hasSolar,
    });
  }

  // Siempre mostrar el beneficio general de deducibilidad
  if (totalInvestment > 0) {
    benefits.push({
      id: "deduccion-general",
      name: "Deducibilidad general de inversiones",
      description:
        "Todas las inversiones en maquinaria y equipo son deducibles conforme a las " +
        "tasas del Art. 34 LISR. La inversión en eficiencia energética es gastos de operación " +
        "que reducen la base gravable.",
      estimated_value_mxn: Math.round(totalInvestment * 0.1), // 10% conservador
      legal_reference: "Art. 31-34, LISR — Deducción de inversiones",
      applicable: true,
    });
  }

  return benefits;
}

// ─── Impacto ambiental ───

/**
 * Calcula métricas de impacto ambiental.
 * Factor de emisión: SEMARNAT Factor del SEN 2024.
 * Equivalencias: EPA Greenhouse Gas Equivalencies Calculator.
 */
export function calculateEnvironmentalImpact(
  invoices: CFEInvoice[],
  solutions: ProposedSolution[]
): EnvironmentalMetric {
  const totalKwh = invoices.reduce((sum, inv) => sum + inv.total_kwh, 0);
  const totalMwh = totalKwh / 1000;
  const factor = EMISSION_FACTORS.sen_current.value; // 0.444 tCO2e/MWh

  const totalCO2 = totalMwh * factor;

  const annualSavingsKwh = solutions.reduce((sum, s) => sum + (s.monthly_savings / 2.5) * 12, 0); // Estimación kWh desde MXN
  const reductionCO2 = (annualSavingsKwh / 1000) * factor;

  // Equivalencias (EPA):
  // 1 árbol absorbe ~0.022 tCO2/año (promedio urbano)
  // 1 auto emite ~4.6 tCO2/año (promedio)
  const treeEquivalents = Math.round(reductionCO2 / 0.022);
  const carEquivalents = Math.round(reductionCO2 / 4.6 * 10) / 10;

  return {
    total_co2_tons: Math.round(totalCO2 * 10) / 10,
    reduction_potential_tons: Math.round(reductionCO2 * 10) / 10,
    tree_equivalents: treeEquivalents,
    car_equivalents: carEquivalents,
  };
}

// ─── Proyección financiera ───

/**
 * Calcula la proyección de ahorros acumulados a 10 años.
 */
export function calculateFinancialProjection(
  solutions: ProposedSolution[]
): {
  totalInvestment: number;
  annualSavings: number;
  avgRoiMonths: number;
  cumulativeSavings: { year: number; savings: number; netSavings: number }[];
} {
  const totalInvestment = solutions.reduce((sum, s) => sum + s.investment, 0);
  const annualSavings = solutions.reduce((sum, s) => sum + s.annual_savings, 0);

  const avgRoi = solutions.length > 0
    ? solutions.reduce((sum, s) => sum + s.roi_months, 0) / solutions.length
    : 0;

  const cumulativeSavings = Array.from({ length: 10 }, (_, i) => {
    const year = i + 1;
    const savings = annualSavings * year;
    return {
      year,
      savings,
      netSavings: savings - totalInvestment,
    };
  });

  return {
    totalInvestment,
    annualSavings,
    avgRoiMonths: Math.round(avgRoi * 10) / 10,
    cumulativeSavings,
  };
}
