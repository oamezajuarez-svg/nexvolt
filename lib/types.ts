export type UserRole = "operator" | "client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company: string;
  avatar_url?: string;
}

export interface Client {
  id: string;
  name: string;
  rfc: string;
  industry: string;
  location: string;
  status: "active" | "prospect" | "inactive";
  tariff: string;
  monthly_cost: number;
  created_at: string;
}

export interface InvoiceData {
  id: string;
  client_id: string;
  period: string;
  consumption_kwh: number;
  demand_kw: number;
  power_factor: number;
  total_cost: number;
  tariff: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  type: SolutionType;
  status: "proposal" | "approved" | "in_progress" | "installed" | "monitoring";
  investment: number;
  estimated_savings: number;
  roi_months: number;
  start_date: string;
}

export type SolutionType =
  | "solar_pv"
  | "bess"
  | "capacitor_bank"
  | "vfd"
  | "led"
  | "mem_migration";

export interface Alert {
  id: string;
  client_id: string;
  client_name: string;
  type: "danger" | "warning" | "info";
  message: string;
  timestamp: string;
}

export interface KPI {
  label: string;
  value: string;
  change: number;
  icon: string;
}

// ─── CFE Invoice detailed ───

export interface CFEInvoice {
  id: string;
  client_id: string;
  period: string; // "Ene 2026"
  month_index: number; // 0-11
  // Consumo por periodo
  consumption_base_kwh: number;
  consumption_intermedia_kwh: number;
  consumption_punta_kwh: number;
  total_kwh: number;
  // Demanda
  demand_max_kw: number;
  demand_contracted_kw: number;
  demand_billed_kw: number;
  // Factor de potencia
  power_factor: number;
  power_factor_penalty_pct: number; // % recargo o bonificación
  // Costos desglosados
  cost_energy: number;
  cost_demand: number;
  cost_distribution: number;
  cost_transmission: number;
  cost_power_factor: number; // positivo = penalización, negativo = bonificación
  subtotal: number;
  iva: number;
  total_cost: number;
  // Tarifa
  tariff: string;
}

// ─── Anomalías detectadas ───

export type AnomalySource = "cfe" | "monitoring";
export type AnomalySeverity = "critical" | "high" | "medium" | "low";
export type AnomalyCategory =
  | "power_factor"
  | "demand_overrun"
  | "consumption_spike"
  | "voltage_sag"
  | "harmonic_distortion"
  | "load_imbalance"
  | "billing_error"
  | "energy_waste";

export interface Anomaly {
  id: string;
  client_id: string;
  source: AnomalySource;
  severity: AnomalySeverity;
  category: AnomalyCategory;
  title: string;
  description: string;
  detected_at: string;
  period?: string; // para anomalías CFE
  financial_impact_monthly: number; // MXN/mes de pérdida
  status: "active" | "acknowledged" | "resolved";
}

// ─── Soluciones propuestas ───

export type SolutionUrgency = "immediate" | "short_term" | "medium_term";
export type SolutionImpact = "high" | "medium" | "low";

export interface ProposedSolution {
  id: string;
  client_id: string;
  anomaly_ids: string[]; // anomalías que resuelve
  type: SolutionType;
  name: string;
  description: string;
  urgency: SolutionUrgency;
  impact: SolutionImpact;
  investment: number;
  monthly_savings: number;
  annual_savings: number;
  roi_months: number;
  payback_date: string;
  co2_reduction_tons: number;
  status: "proposed" | "approved" | "rejected" | "installed";
}

// ─── Monitoreo en vivo ───

export interface LiveReading {
  timestamp: string;
  voltage_l1: number;
  voltage_l2: number;
  voltage_l3: number;
  current_l1: number;
  current_l2: number;
  current_l3: number;
  power_kw: number;
  reactive_kvar: number;
  apparent_kva: number;
  power_factor: number;
  frequency_hz: number;
  thd_v_pct: number; // distorsión armónica voltaje
  thd_i_pct: number; // distorsión armónica corriente
}

export interface MonitoringDevice {
  id: string;
  client_id: string;
  name: string;
  model: string; // "Carlo Gavazzi EM340" | "Schneider PM5560" | "Shelly Pro 3EM"
  location: string; // "Tablero principal", "Subestación 1"
  status: "online" | "offline" | "warning";
  last_reading: LiveReading;
}

// ─── Perfil de planta ───

export interface PlantProfile {
  total_area_m2: number;
  production_area_m2: number;
  office_area_m2: number;
  warehouse_area_m2: number;
  shifts_per_day: number;
  hours_per_shift: number;
  days_per_week: number;
  operating_days_per_year: number;
  production_volume: number | null;
  production_unit: string | null; // "toneladas", "piezas", "m3", etc.
  process_description: string;
  transformer_capacity_kva: number;
  transformer_count: number;
  voltage_level: string; // "220V", "440V", "23kV"
  substation_count: number;
  has_generator: boolean;
  generator_capacity_kva: number | null;
}

// ─── Inventario de equipos ───

export type EquipmentCategory = "motor" | "lighting" | "hvac" | "compressed_air" | "other";
export type EquipmentCondition = "good" | "fair" | "poor";

export interface EquipmentBase {
  id: string;
  client_id: string;
  category: EquipmentCategory;
  name: string;
  location: string; // "Línea de producción 1", "Oficinas", etc.
  brand: string;
  model: string;
  age_years: number;
  condition: EquipmentCondition;
  hours_per_day: number;
  days_per_year: number;
  notes: string;
}

export interface MotorEquipment extends EquipmentBase {
  category: "motor";
  rated_hp: number;
  rated_kw: number;
  voltage: number;
  efficiency_pct: number | null; // null = desconocido
  load_factor_pct: number; // 0-100, % de carga típica
  motor_type: "induction" | "synchronous" | "dc" | "other";
}

export interface LightingEquipment extends EquipmentBase {
  category: "lighting";
  area_name: string;
  lamp_type: "fluorescent" | "led" | "hid" | "halogen" | "incandescent";
  quantity: number;
  wattage_per_unit: number;
  area_m2: number;
  current_lux: number | null;
  required_lux_nom025: string; // key de ILLUMINATION_LEVELS: "machine_work", "offices", etc.
}

export interface HVACEquipment extends EquipmentBase {
  category: "hvac";
  hvac_type: "split" | "chiller" | "package" | "mini_split" | "cooling_tower";
  capacity_tr: number | null;
  capacity_btu: number | null;
  refrigerant: string;
  eer: number | null;
  cop: number | null;
}

export interface CompressedAirEquipment extends EquipmentBase {
  category: "compressed_air";
  compressor_type: "reciprocating" | "screw" | "centrifugal";
  rated_hp: number;
  rated_kw: number;
  pressure_psi: number;
  estimated_cfm: number;
  num_compressors: number;
}

export interface OtherEquipment extends EquipmentBase {
  category: "other";
  equipment_type: string; // "welding", "furnace", "pump", "conveyor", "press", etc.
  rated_kw: number;
  voltage: number;
}

export type Equipment =
  | MotorEquipment
  | LightingEquipment
  | HVACEquipment
  | CompressedAirEquipment
  | OtherEquipment;

// ─── Balance energético ───

export interface EnergyBalanceCategory {
  category: string; // "Motores", "Iluminación", "HVAC", etc.
  equipment_category: EquipmentCategory;
  annual_kwh: number;
  pct_of_total: number;
  annual_cost_mxn: number;
  equipment_count: number;
  equipment_ids: string[];
}

// ─── Progreso de auditoría ───

export type AuditStepStatus = "complete" | "partial" | "pending";

export interface AuditStep {
  id: string;
  label: string;
  status: AuditStepStatus;
  pct: number; // 0-100
}

export interface AuditProgress {
  client_id: string;
  steps: AuditStep[];
  overall_pct: number;
}

// ─── Certificaciones y beneficios ───

export interface CertificationItem {
  label: string;
  met: boolean;
  source: string; // qué dato se necesita
}

export interface CertificationReadiness {
  conuee_pct: number;
  leed_pct: number;
  iso50001_pct: number;
  conuee_items: CertificationItem[];
  leed_items: CertificationItem[];
  iso50001_items: CertificationItem[];
}

export interface FiscalBenefit {
  id: string;
  name: string;
  description: string;
  estimated_value_mxn: number;
  legal_reference: string;
  applicable: boolean;
}

export interface EnvironmentalMetric {
  total_co2_tons: number;
  reduction_potential_tons: number;
  tree_equivalents: number; // 1 árbol ≈ 0.022 tCO2/año
  car_equivalents: number; // 1 auto ≈ 4.6 tCO2/año
}

// ─── Resumen de consumo por equipo ───

export type EfficiencyFlag = "compliant" | "below_standard" | "unknown";

export interface EquipmentSummary {
  equipment_id: string;
  annual_kwh: number;
  annual_cost_mxn: number;
  pct_of_total: number;
  efficiency_flag: EfficiencyFlag;
  efficiency_standard: string; // "ASHRAE 90.1", "NOM-025-STPS", etc.
  efficiency_detail: string; // "87% vs 95.4% requerido"
}

// ─── Client detail ───

export interface ClientDetail extends Client {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contracted_demand_kw: number;
  supply_voltage: string;
  meter_number: string;
  rpu: string; // Registro Permanente Único CFE
  invoices: CFEInvoice[];
  anomalies: Anomaly[];
  proposed_solutions: ProposedSolution[];
  monitoring_devices: MonitoringDevice[];
  // Nuevos campos para pilotos
  plant_profile?: PlantProfile;
  equipment?: Equipment[];
  energy_balance?: EnergyBalanceCategory[];
  audit_progress?: AuditProgress;
  certifications?: CertificationReadiness;
}
