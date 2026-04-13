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
}
