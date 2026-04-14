import type {
  Equipment,
  EquipmentSummary,
  EnergyBalanceCategory,
  PlantProfile,
  CFEInvoice,
  EfficiencyFlag,
} from "../types";
import { ASHRAE_EFFICIENCY } from "../standards/efficiency";
import { ILLUMINATION_LEVELS, LIGHTING_POWER_DENSITY } from "../standards/illumination";

// ─── Consumo por equipo ───

/**
 * Calcula el consumo anual estimado de un equipo individual.
 * Fórmulas basadas en ASHRAE 90.1 / CONUEE metodología de diagnóstico.
 */
export function calculateEquipmentConsumption(
  equipment: Equipment,
  avgCostPerKwh: number = 2.5 // MXN/kWh promedio
): EquipmentSummary {
  let annualKwh = 0;
  let flag: EfficiencyFlag = "unknown";
  let standard = "";
  let detail = "";

  const hoursPerYear = equipment.hours_per_day * equipment.days_per_year;

  switch (equipment.category) {
    case "motor": {
      const loadFactor = equipment.load_factor_pct / 100;
      annualKwh = equipment.rated_kw * loadFactor * hoursPerYear;

      const minEff = ASHRAE_EFFICIENCY.motor_min_efficiency.value;
      standard = ASHRAE_EFFICIENCY.motor_min_efficiency.reference.standard;

      if (equipment.efficiency_pct !== null) {
        if (equipment.efficiency_pct >= minEff) {
          flag = "compliant";
          detail = `${equipment.efficiency_pct}% ≥ ${minEff}% requerido`;
        } else {
          flag = "below_standard";
          detail = `${equipment.efficiency_pct}% < ${minEff}% requerido`;
        }
      } else {
        detail = "Eficiencia no medida";
      }
      break;
    }

    case "lighting": {
      const totalWatts = equipment.quantity * equipment.wattage_per_unit;
      annualKwh = (totalWatts / 1000) * hoursPerYear;

      // Check NOM-025 lux levels
      const nomLevel = ILLUMINATION_LEVELS[equipment.required_lux_nom025];
      standard = "NOM-025-STPS-2008";

      if (nomLevel && equipment.current_lux !== null) {
        if (equipment.current_lux >= nomLevel.value) {
          // Check LPD (W/m²)
          const actualLpd = totalWatts / equipment.area_m2;
          const lpdRef = getLpdForType(equipment.area_name);
          if (lpdRef && actualLpd > lpdRef.ashrae_max) {
            flag = "below_standard";
            detail = `LPD ${actualLpd.toFixed(1)} W/m² > ${lpdRef.ashrae_max} W/m² (ASHRAE 90.1)`;
            standard = "ASHRAE 90.1-2022 / NOM-025-STPS";
          } else {
            flag = "compliant";
            detail = `${equipment.current_lux} lux ≥ ${nomLevel.value} lux NOM-025`;
          }
        } else {
          flag = "below_standard";
          detail = `${equipment.current_lux} lux < ${nomLevel.value} lux requeridos (NOM-025)`;
        }
      } else {
        detail = "Nivel de lux no medido";
      }
      break;
    }

    case "hvac": {
      // Estimación basada en capacidad y horas
      const kw = equipment.capacity_tr
        ? equipment.capacity_tr * 3.517 / (equipment.eer ? equipment.eer / 3.412 : 2.5)
        : (equipment.capacity_btu || 0) / 1000 / (equipment.eer ? equipment.eer / 3.412 : 2.5);
      annualKwh = kw * hoursPerYear;

      standard = "ASHRAE 90.1-2022 — HVAC efficiency";
      if (equipment.eer !== null) {
        if (equipment.eer >= 12.0) {
          flag = "compliant";
          detail = `EER ${equipment.eer} ≥ 12.0`;
        } else {
          flag = "below_standard";
          detail = `EER ${equipment.eer} < 12.0 recomendado`;
        }
      } else {
        detail = "EER no disponible";
      }
      break;
    }

    case "compressed_air": {
      const loadFactor = 0.75; // Factor típico de carga en aire comprimido
      annualKwh = equipment.rated_kw * loadFactor * hoursPerYear;

      standard = "Mejores prácticas de aire comprimido (DOE/CAGI)";
      // Eficiencia específica: kW/100 CFM
      const kwPer100cfm = (equipment.rated_kw / equipment.estimated_cfm) * 100;
      if (kwPer100cfm <= 22) {
        flag = "compliant";
        detail = `${kwPer100cfm.toFixed(1)} kW/100CFM ≤ 22 kW/100CFM`;
      } else {
        flag = "below_standard";
        detail = `${kwPer100cfm.toFixed(1)} kW/100CFM > 22 kW/100CFM referencia`;
      }
      break;
    }

    case "other": {
      const loadFactor = 0.7; // Factor genérico
      annualKwh = equipment.rated_kw * loadFactor * hoursPerYear;
      standard = "Estimación por potencia nominal";
      detail = `${equipment.rated_kw} kW × ${(loadFactor * 100).toFixed(0)}% carga × ${hoursPerYear} h/año`;
      break;
    }
  }

  return {
    equipment_id: equipment.id,
    annual_kwh: Math.round(annualKwh),
    annual_cost_mxn: Math.round(annualKwh * avgCostPerKwh),
    pct_of_total: 0, // Se calcula después en el balance
    efficiency_flag: flag,
    efficiency_standard: standard,
    efficiency_detail: detail,
  };
}

// ─── Balance energético ───

/**
 * Calcula el balance energético agrupado por categoría.
 * Compara consumo estimado de equipos vs consumo real facturado.
 * Ref: CONUEE Diagnóstico Energético, Sección 4 — Balance Energético.
 */
export function calculateEnergyBalance(
  equipment: Equipment[],
  invoices: CFEInvoice[],
  avgCostPerKwh: number = 2.5
): {
  categories: EnergyBalanceCategory[];
  totalEquipmentKwh: number;
  totalInvoicedKwh: number;
  unaccountedKwh: number;
  unaccountedPct: number;
} {
  const summaries = equipment.map((eq) => ({
    equipment: eq,
    summary: calculateEquipmentConsumption(eq, avgCostPerKwh),
  }));

  const totalInvoicedKwh = invoices.reduce((sum, inv) => sum + inv.total_kwh, 0);
  const totalEquipmentKwh = summaries.reduce((sum, s) => sum + s.summary.annual_kwh, 0);

  // Agrupar por categoría
  const categoryMap = new Map<string, {
    label: string;
    category: Equipment["category"];
    kwh: number;
    cost: number;
    count: number;
    ids: string[];
  }>();

  const categoryLabels: Record<string, string> = {
    motor: "Motores y accionamientos",
    lighting: "Iluminación",
    hvac: "HVAC y refrigeración",
    compressed_air: "Aire comprimido",
    other: "Otros equipos",
  };

  for (const { equipment: eq, summary } of summaries) {
    const existing = categoryMap.get(eq.category) || {
      label: categoryLabels[eq.category],
      category: eq.category,
      kwh: 0,
      cost: 0,
      count: 0,
      ids: [],
    };
    existing.kwh += summary.annual_kwh;
    existing.cost += summary.annual_cost_mxn;
    existing.count += 1;
    existing.ids.push(eq.id);
    categoryMap.set(eq.category, existing);
  }

  const categories: EnergyBalanceCategory[] = Array.from(categoryMap.values()).map((cat) => ({
    category: cat.label,
    equipment_category: cat.category,
    annual_kwh: cat.kwh,
    pct_of_total: totalInvoicedKwh > 0 ? (cat.kwh / totalInvoicedKwh) * 100 : 0,
    annual_cost_mxn: cat.cost,
    equipment_count: cat.count,
    equipment_ids: cat.ids,
  }));

  // Ordenar por consumo descendente
  categories.sort((a, b) => b.annual_kwh - a.annual_kwh);

  const unaccountedKwh = Math.max(0, totalInvoicedKwh - totalEquipmentKwh);
  const unaccountedPct = totalInvoicedKwh > 0 ? (unaccountedKwh / totalInvoicedKwh) * 100 : 0;

  return {
    categories,
    totalEquipmentKwh,
    totalInvoicedKwh,
    unaccountedKwh,
    unaccountedPct,
  };
}

// ─── Intensidad energética ───

/**
 * Calcula indicadores de intensidad energética.
 * Ref: CONUEE Diagnóstico Energético, Sección 5.
 */
export function calculateEnergyIntensity(
  totalKwh: number,
  plantProfile: PlantProfile
): {
  kwh_per_m2: number;
  kwh_per_unit: number | null;
  mj_per_m2: number;
} {
  const kwhPerM2 = plantProfile.total_area_m2 > 0
    ? totalKwh / plantProfile.total_area_m2
    : 0;

  const kwhPerUnit = plantProfile.production_volume
    ? totalKwh / plantProfile.production_volume
    : null;

  return {
    kwh_per_m2: Math.round(kwhPerM2 * 10) / 10,
    kwh_per_unit: kwhPerUnit !== null ? Math.round(kwhPerUnit * 10) / 10 : null,
    mj_per_m2: Math.round(kwhPerM2 * 3.6 * 10) / 10,
  };
}

// ─── Helpers internos ───

function getLpdForType(areaName: string): { ashrae_max: number; efficient_target: number } | null {
  const lower = areaName.toLowerCase();
  if (lower.includes("oficina")) return LIGHTING_POWER_DENSITY.office;
  if (lower.includes("bodega") || lower.includes("almacén") || lower.includes("almacen"))
    return LIGHTING_POWER_DENSITY.warehouse;
  if (lower.includes("producción") || lower.includes("produccion") || lower.includes("maquinado"))
    return LIGHTING_POWER_DENSITY.manufacturing;
  if (lower.includes("estacionamiento") || lower.includes("parking"))
    return LIGHTING_POWER_DENSITY.parking;
  return null;
}
