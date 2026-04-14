import type {
  MotorEquipment,
  LightingEquipment,
  HVACEquipment,
  CompressedAirEquipment,
  OtherEquipment,
  Equipment,
} from "./types";

// ─── Motores ───

const motors: MotorEquipment[] = [
  {
    id: "eq-m1", client_id: "1", category: "motor",
    name: "Motor línea producción 1", location: "Línea de producción 1",
    brand: "WEG", model: "W22 Plus", age_years: 8, condition: "good",
    hours_per_day: 18, days_per_year: 300, notes: "Motor principal de la línea 1",
    rated_hp: 75, rated_kw: 55.9, voltage: 220,
    efficiency_pct: 94.5, load_factor_pct: 80, motor_type: "induction",
  },
  {
    id: "eq-m2", client_id: "1", category: "motor",
    name: "Motor línea producción 2", location: "Línea de producción 2",
    brand: "WEG", model: "W22 Plus", age_years: 8, condition: "good",
    hours_per_day: 18, days_per_year: 300, notes: "Motor principal de la línea 2",
    rated_hp: 75, rated_kw: 55.9, voltage: 220,
    efficiency_pct: 94.5, load_factor_pct: 75, motor_type: "induction",
  },
  {
    id: "eq-m3", client_id: "1", category: "motor",
    name: "Motor compresor principal", location: "Cuarto de compresores",
    brand: "Siemens", model: "1LE1", age_years: 12, condition: "fair",
    hours_per_day: 16, days_per_year: 300, notes: "Motor del compresor de tornillo",
    rated_hp: 50, rated_kw: 37.3, voltage: 220,
    efficiency_pct: 88.0, load_factor_pct: 85, motor_type: "induction",
  },
  {
    id: "eq-m4", client_id: "1", category: "motor",
    name: "Bomba de agua de proceso", location: "Cuarto de máquinas",
    brand: "ABB", model: "M3BP 200", age_years: 15, condition: "fair",
    hours_per_day: 20, days_per_year: 300, notes: "Bomba centrífuga agua de proceso. Alta antigüedad.",
    rated_hp: 30, rated_kw: 22.4, voltage: 220,
    efficiency_pct: 86.5, load_factor_pct: 70, motor_type: "induction",
  },
  {
    id: "eq-m5", client_id: "1", category: "motor",
    name: "Transportador banda principal", location: "Producción",
    brand: "SEW-Eurodrive", model: "DRN 132", age_years: 6, condition: "good",
    hours_per_day: 18, days_per_year: 300, notes: "Banda transportadora entre estaciones",
    rated_hp: 15, rated_kw: 11.2, voltage: 220,
    efficiency_pct: 91.0, load_factor_pct: 60, motor_type: "induction",
  },
  {
    id: "eq-m6", client_id: "1", category: "motor",
    name: "Ventilador extractor nave", location: "Techo nave producción",
    brand: "Baldor", model: "EM3714T", age_years: 10, condition: "fair",
    hours_per_day: 20, days_per_year: 300, notes: "Extracción de calor y humos",
    rated_hp: 10, rated_kw: 7.5, voltage: 220,
    efficiency_pct: 87.5, load_factor_pct: 90, motor_type: "induction",
  },
  {
    id: "eq-m7", client_id: "1", category: "motor",
    name: "Motor CNC #1", location: "Área de maquinado",
    brand: "Fanuc", model: "αiF 22/3000", age_years: 4, condition: "good",
    hours_per_day: 16, days_per_year: 300, notes: "Husillo CNC alta precisión",
    rated_hp: 30, rated_kw: 22.0, voltage: 220,
    efficiency_pct: 96.0, load_factor_pct: 65, motor_type: "synchronous",
  },
  {
    id: "eq-m8", client_id: "1", category: "motor",
    name: "Motor CNC #2", location: "Área de maquinado",
    brand: "Fanuc", model: "αiF 12/3000", age_years: 4, condition: "good",
    hours_per_day: 16, days_per_year: 300, notes: "Husillo CNC",
    rated_hp: 15, rated_kw: 11.0, voltage: 220,
    efficiency_pct: 95.5, load_factor_pct: 60, motor_type: "synchronous",
  },
];

// ─── Iluminación ───

const lighting: LightingEquipment[] = [
  {
    id: "eq-l1", client_id: "1", category: "lighting",
    name: "Iluminación nave producción", location: "Nave de producción",
    brand: "Philips", model: "HPI Plus 400W", age_years: 12, condition: "fair",
    hours_per_day: 20, days_per_year: 300, notes: "Lámparas HID suspendidas a 8m. Bajo rendimiento lumínico.",
    area_name: "Producción", lamp_type: "hid", quantity: 24, wattage_per_unit: 400,
    area_m2: 2000, current_lux: 250, required_lux_nom025: "machine_work",
  },
  {
    id: "eq-l2", client_id: "1", category: "lighting",
    name: "Iluminación oficinas", location: "Oficinas administrativas",
    brand: "Sylvania", model: "T8 32W", age_years: 8, condition: "fair",
    hours_per_day: 10, days_per_year: 300, notes: "Fluorescentes T8 empotradas en plafón",
    area_name: "Oficinas", lamp_type: "fluorescent", quantity: 48, wattage_per_unit: 32,
    area_m2: 600, current_lux: 320, required_lux_nom025: "offices",
  },
  {
    id: "eq-l3", client_id: "1", category: "lighting",
    name: "Iluminación almacén", location: "Bodega y almacén",
    brand: "Philips", model: "HPI Plus 250W", age_years: 14, condition: "poor",
    hours_per_day: 12, days_per_year: 300, notes: "HID 250W. Varias luminarias fuera de servicio.",
    area_name: "Almacén", lamp_type: "hid", quantity: 8, wattage_per_unit: 250,
    area_m2: 400, current_lux: 80, required_lux_nom025: "corridors_storage",
  },
  {
    id: "eq-l4", client_id: "1", category: "lighting",
    name: "Iluminación área de maquinado", location: "CNC y maquinado",
    brand: "Osram", model: "HQI-E 400W", age_years: 10, condition: "fair",
    hours_per_day: 16, days_per_year: 300, notes: "Requiere mejor nivel de iluminación para trabajo de detalle",
    area_name: "Maquinado", lamp_type: "hid", quantity: 12, wattage_per_unit: 400,
    area_m2: 500, current_lux: 380, required_lux_nom025: "detail_work",
  },
  {
    id: "eq-l5", client_id: "1", category: "lighting",
    name: "Iluminación estacionamiento", location: "Exterior",
    brand: "Generic", model: "HPS 150W", age_years: 15, condition: "poor",
    hours_per_day: 12, days_per_year: 365, notes: "Sodio alta presión exterior. Control fotocélula.",
    area_name: "Estacionamiento", lamp_type: "hid", quantity: 6, wattage_per_unit: 150,
    area_m2: 800, current_lux: 15, required_lux_nom025: "exterior_general",
  },
  {
    id: "eq-l6", client_id: "1", category: "lighting",
    name: "Iluminación comedor", location: "Comedor y área de descanso",
    brand: "Tecnolite", model: "Panel LED 40W", age_years: 2, condition: "good",
    hours_per_day: 14, days_per_year: 300, notes: "Ya migrado a LED. Buen estado.",
    area_name: "Comedor", lamp_type: "led", quantity: 12, wattage_per_unit: 40,
    area_m2: 200, current_lux: 350, required_lux_nom025: "offices",
  },
];

// ─── HVAC / Refrigeración ───

const hvac: HVACEquipment[] = [
  {
    id: "eq-h1", client_id: "1", category: "hvac",
    name: "Paquete rooftop oficinas", location: "Techo oficinas",
    brand: "Carrier", model: "50XC 10TR", age_years: 9, condition: "fair",
    hours_per_day: 10, days_per_year: 280, notes: "Enfriamiento de oficinas. Refrigerante R-410A.",
    hvac_type: "package", capacity_tr: 10, capacity_btu: 120000,
    refrigerant: "R-410A", eer: 10.5, cop: null,
  },
  {
    id: "eq-h2", client_id: "1", category: "hvac",
    name: "Chiller proceso", location: "Cuarto de máquinas",
    brand: "Trane", model: "CGAM 20TR", age_years: 11, condition: "fair",
    hours_per_day: 18, days_per_year: 300, notes: "Enfriamiento de agua para proceso de maquinado. EER bajo.",
    hvac_type: "chiller", capacity_tr: 20, capacity_btu: 240000,
    refrigerant: "R-134a", eer: 8.5, cop: 2.8,
  },
  {
    id: "eq-h3", client_id: "1", category: "hvac",
    name: "Mini splits sala de juntas", location: "Sala de juntas",
    brand: "Mirage", model: "Absolut X 2TR", age_years: 3, condition: "good",
    hours_per_day: 6, days_per_year: 280, notes: "Inverter. Eficiente.",
    hvac_type: "mini_split", capacity_tr: 2, capacity_btu: 24000,
    refrigerant: "R-32", eer: 15.0, cop: 4.2,
  },
];

// ─── Aire comprimido ───

const compressedAir: CompressedAirEquipment[] = [
  {
    id: "eq-c1", client_id: "1", category: "compressed_air",
    name: "Compresor tornillo principal", location: "Cuarto de compresores",
    brand: "Atlas Copco", model: "GA 37+", age_years: 7, condition: "good",
    hours_per_day: 16, days_per_year: 300, notes: "Compresor principal. Velocidad fija, sin VFD.",
    compressor_type: "screw", rated_hp: 50, rated_kw: 37.0,
    pressure_psi: 125, estimated_cfm: 180, num_compressors: 1,
  },
  {
    id: "eq-c2", client_id: "1", category: "compressed_air",
    name: "Compresor reciprocante respaldo", location: "Cuarto de compresores",
    brand: "Ingersoll Rand", model: "2545", age_years: 18, condition: "poor",
    hours_per_day: 4, days_per_year: 300, notes: "Solo se usa como respaldo. Alta antigüedad, bajo rendimiento.",
    compressor_type: "reciprocating", rated_hp: 30, rated_kw: 22.4,
    pressure_psi: 150, estimated_cfm: 100, num_compressors: 1,
  },
];

// ─── Otros equipos ───

const other: OtherEquipment[] = [
  {
    id: "eq-o1", client_id: "1", category: "other",
    name: "Soldadora MIG industrial", location: "Área de soldadura",
    brand: "Lincoln Electric", model: "Power Wave S500", age_years: 5, condition: "good",
    hours_per_day: 12, days_per_year: 300, notes: "2 estaciones de soldadura",
    equipment_type: "welding", rated_kw: 22.0, voltage: 220,
  },
  {
    id: "eq-o2", client_id: "1", category: "other",
    name: "Prensa hidráulica 100 ton", location: "Línea de producción 1",
    brand: "Schuler", model: "C-Frame 100T", age_years: 14, condition: "fair",
    hours_per_day: 14, days_per_year: 300, notes: "Motor hidráulico de 30HP. Alta demanda en arranque.",
    equipment_type: "press", rated_kw: 22.4, voltage: 220,
  },
  {
    id: "eq-o3", client_id: "1", category: "other",
    name: "Horno de tratamiento térmico", location: "Área de tratamiento térmico",
    brand: "Nabertherm", model: "N 500/14", age_years: 6, condition: "good",
    hours_per_day: 8, days_per_year: 250, notes: "Horno eléctrico para temple y revenido",
    equipment_type: "furnace", rated_kw: 45.0, voltage: 220,
  },
  {
    id: "eq-o4", client_id: "1", category: "other",
    name: "Línea de empaque", location: "Área de empaque",
    brand: "Bosch", model: "Pack 401", age_years: 3, condition: "good",
    hours_per_day: 10, days_per_year: 300, notes: "Línea automática de empaque y etiquetado",
    equipment_type: "packaging", rated_kw: 8.5, voltage: 220,
  },
];

// ─── Export consolidado ───

export const mockEquipment: Equipment[] = [
  ...motors,
  ...lighting,
  ...hvac,
  ...compressedAir,
  ...other,
];

export const mockMotors = motors;
export const mockLighting = lighting;
export const mockHVAC = hvac;
export const mockCompressedAir = compressedAir;
export const mockOther = other;
