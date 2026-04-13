import {
  ClientDetail,
  CFEInvoice,
  Anomaly,
  ProposedSolution,
  MonitoringDevice,
} from "./types";

// ─── 12 meses de recibos CFE para "Industrias del Norte SA" ───

const invoices: CFEInvoice[] = [
  {
    id: "inv-01", client_id: "1", period: "May 2025", month_index: 0,
    consumption_base_kwh: 18200, consumption_intermedia_kwh: 16800, consumption_punta_kwh: 7500,
    total_kwh: 42500, demand_max_kw: 320, demand_contracted_kw: 300, demand_billed_kw: 320,
    power_factor: 0.82, power_factor_penalty_pct: 7.2,
    cost_energy: 112000, cost_demand: 38400, cost_distribution: 12800, cost_transmission: 6400,
    cost_power_factor: 12200, subtotal: 181800, iva: 29088, total_cost: 210888,
    tariff: "GDMTH",
  },
  {
    id: "inv-02", client_id: "1", period: "Jun 2025", month_index: 1,
    consumption_base_kwh: 20100, consumption_intermedia_kwh: 19200, consumption_punta_kwh: 8900,
    total_kwh: 48200, demand_max_kw: 345, demand_contracted_kw: 300, demand_billed_kw: 345,
    power_factor: 0.80, power_factor_penalty_pct: 10.0,
    cost_energy: 128500, cost_demand: 41400, cost_distribution: 14500, cost_transmission: 7250,
    cost_power_factor: 19165, subtotal: 210815, iva: 33730, total_cost: 244545,
    tariff: "GDMTH",
  },
  {
    id: "inv-03", client_id: "1", period: "Jul 2025", month_index: 2,
    consumption_base_kwh: 21500, consumption_intermedia_kwh: 20200, consumption_punta_kwh: 9300,
    total_kwh: 51000, demand_max_kw: 358, demand_contracted_kw: 300, demand_billed_kw: 358,
    power_factor: 0.78, power_factor_penalty_pct: 13.4,
    cost_energy: 136200, cost_demand: 42960, cost_distribution: 15300, cost_transmission: 7650,
    cost_power_factor: 27082, subtotal: 229192, iva: 36670, total_cost: 265862,
    tariff: "GDMTH",
  },
  {
    id: "inv-04", client_id: "1", period: "Ago 2025", month_index: 3,
    consumption_base_kwh: 20800, consumption_intermedia_kwh: 19800, consumption_punta_kwh: 9200,
    total_kwh: 49800, demand_max_kw: 350, demand_contracted_kw: 300, demand_billed_kw: 350,
    power_factor: 0.79, power_factor_penalty_pct: 11.6,
    cost_energy: 132800, cost_demand: 42000, cost_distribution: 14940, cost_transmission: 7470,
    cost_power_factor: 22876, subtotal: 220086, iva: 35213, total_cost: 255299,
    tariff: "GDMTH",
  },
  {
    id: "inv-05", client_id: "1", period: "Sep 2025", month_index: 4,
    consumption_base_kwh: 19200, consumption_intermedia_kwh: 18500, consumption_punta_kwh: 8600,
    total_kwh: 46300, demand_max_kw: 330, demand_contracted_kw: 300, demand_billed_kw: 330,
    power_factor: 0.81, power_factor_penalty_pct: 8.5,
    cost_energy: 123400, cost_demand: 39600, cost_distribution: 13890, cost_transmission: 6945,
    cost_power_factor: 15626, subtotal: 199461, iva: 31913, total_cost: 231374,
    tariff: "GDMTH",
  },
  {
    id: "inv-06", client_id: "1", period: "Oct 2025", month_index: 5,
    consumption_base_kwh: 18000, consumption_intermedia_kwh: 17100, consumption_punta_kwh: 8000,
    total_kwh: 43100, demand_max_kw: 310, demand_contracted_kw: 300, demand_billed_kw: 310,
    power_factor: 0.83, power_factor_penalty_pct: 5.8,
    cost_energy: 114800, cost_demand: 37200, cost_distribution: 12930, cost_transmission: 6465,
    cost_power_factor: 9960, subtotal: 181355, iva: 29016, total_cost: 210371,
    tariff: "GDMTH",
  },
  {
    id: "inv-07", client_id: "1", period: "Nov 2025", month_index: 6,
    consumption_base_kwh: 16500, consumption_intermedia_kwh: 15800, consumption_punta_kwh: 7500,
    total_kwh: 39800, demand_max_kw: 295, demand_contracted_kw: 300, demand_billed_kw: 300,
    power_factor: 0.84, power_factor_penalty_pct: 4.6,
    cost_energy: 106100, cost_demand: 36000, cost_distribution: 11940, cost_transmission: 5970,
    cost_power_factor: 7360, subtotal: 167370, iva: 26779, total_cost: 194149,
    tariff: "GDMTH",
  },
  {
    id: "inv-08", client_id: "1", period: "Dic 2025", month_index: 7,
    consumption_base_kwh: 15400, consumption_intermedia_kwh: 14800, consumption_punta_kwh: 7000,
    total_kwh: 37200, demand_max_kw: 285, demand_contracted_kw: 300, demand_billed_kw: 300,
    power_factor: 0.85, power_factor_penalty_pct: 3.3,
    cost_energy: 99100, cost_demand: 36000, cost_distribution: 11160, cost_transmission: 5580,
    cost_power_factor: 5010, subtotal: 156850, iva: 25096, total_cost: 181946,
    tariff: "GDMTH",
  },
  {
    id: "inv-09", client_id: "1", period: "Ene 2026", month_index: 8,
    consumption_base_kwh: 16000, consumption_intermedia_kwh: 15300, consumption_punta_kwh: 7200,
    total_kwh: 38500, demand_max_kw: 290, demand_contracted_kw: 300, demand_billed_kw: 300,
    power_factor: 0.84, power_factor_penalty_pct: 4.6,
    cost_energy: 102600, cost_demand: 36000, cost_distribution: 11550, cost_transmission: 5775,
    cost_power_factor: 7172, subtotal: 163097, iva: 26095, total_cost: 189192,
    tariff: "GDMTH",
  },
  {
    id: "inv-10", client_id: "1", period: "Feb 2026", month_index: 9,
    consumption_base_kwh: 16700, consumption_intermedia_kwh: 15900, consumption_punta_kwh: 7500,
    total_kwh: 40100, demand_max_kw: 305, demand_contracted_kw: 300, demand_billed_kw: 305,
    power_factor: 0.83, power_factor_penalty_pct: 5.8,
    cost_energy: 106900, cost_demand: 36600, cost_distribution: 12030, cost_transmission: 6015,
    cost_power_factor: 9389, subtotal: 170934, iva: 27349, total_cost: 198283,
    tariff: "GDMTH",
  },
  {
    id: "inv-11", client_id: "1", period: "Mar 2026", month_index: 10,
    consumption_base_kwh: 18500, consumption_intermedia_kwh: 17800, consumption_punta_kwh: 8300,
    total_kwh: 44600, demand_max_kw: 335, demand_contracted_kw: 300, demand_billed_kw: 335,
    power_factor: 0.79, power_factor_penalty_pct: 11.6,
    cost_energy: 118800, cost_demand: 40200, cost_distribution: 13380, cost_transmission: 6690,
    cost_power_factor: 20784, subtotal: 199854, iva: 31976, total_cost: 231830,
    tariff: "GDMTH",
  },
  {
    id: "inv-12", client_id: "1", period: "Abr 2026", month_index: 11,
    consumption_base_kwh: 19800, consumption_intermedia_kwh: 18900, consumption_punta_kwh: 8600,
    total_kwh: 47300, demand_max_kw: 348, demand_contracted_kw: 300, demand_billed_kw: 348,
    power_factor: 0.78, power_factor_penalty_pct: 13.4,
    cost_energy: 126100, cost_demand: 41760, cost_distribution: 14190, cost_transmission: 7095,
    cost_power_factor: 25324, subtotal: 214469, iva: 34315, total_cost: 248784,
    tariff: "GDMTH",
  },
];

// ─── Anomalías detectadas ───

const anomalies: Anomaly[] = [
  {
    id: "anom-01", client_id: "1", source: "cfe", severity: "critical",
    category: "power_factor",
    title: "Factor de potencia crónicamente bajo",
    description: "FP promedio de 0.81 en los últimos 12 meses. Penalizaciones CFE acumuladas de $182,948 MXN. El FP bajó hasta 0.78 en julio 2025 y abril 2026.",
    detected_at: "2026-04-09T10:00:00", period: "May 2025 – Abr 2026",
    financial_impact_monthly: 15245, status: "active",
  },
  {
    id: "anom-02", client_id: "1", source: "cfe", severity: "high",
    category: "demand_overrun",
    title: "Excedente de demanda recurrente",
    description: "La demanda máxima superó los 300 kW contratados en 9 de 12 meses. Pico de 358 kW en julio 2025. Cobro por demanda excedente estimado: $68,400/año.",
    detected_at: "2026-04-09T10:00:00", period: "May 2025 – Abr 2026",
    financial_impact_monthly: 5700, status: "active",
  },
  {
    id: "anom-03", client_id: "1", source: "cfe", severity: "high",
    category: "consumption_spike",
    title: "Consumo en punta excesivo",
    description: "El consumo en horario punta representa 18.2% del total, cuando debería ser <12%. Esto indica equipos de alta carga operando en horario punta innecesariamente.",
    detected_at: "2026-04-09T10:00:00", period: "May 2025 – Abr 2026",
    financial_impact_monthly: 8900, status: "active",
  },
  {
    id: "anom-04", client_id: "1", source: "monitoring", severity: "critical",
    category: "harmonic_distortion",
    title: "Distorsión armónica elevada en línea 2",
    description: "THD de corriente en L2 alcanza 28.5%, superando el límite IEEE 519 de 20%. Probable causa: variadores de frecuencia sin filtros. Riesgo de daño a equipos.",
    detected_at: "2026-04-09T08:15:00",
    financial_impact_monthly: 4200, status: "active",
  },
  {
    id: "anom-05", client_id: "1", source: "monitoring", severity: "high",
    category: "load_imbalance",
    title: "Desbalance de cargas entre fases",
    description: "Diferencia de corriente entre fases de hasta 35%. L3 carga 42A vs L1 con 28A. Genera pérdidas en transformador y sobrecalentamiento.",
    detected_at: "2026-04-08T14:30:00",
    financial_impact_monthly: 3100, status: "active",
  },
  {
    id: "anom-06", client_id: "1", source: "monitoring", severity: "medium",
    category: "voltage_sag",
    title: "Caídas de voltaje frecuentes",
    description: "Se detectaron 14 eventos de sag (>10% caída) en las últimas 2 semanas. Duración promedio: 120ms. Afecta equipos sensibles y PLCs.",
    detected_at: "2026-04-07T22:45:00",
    financial_impact_monthly: 2800, status: "active",
  },
  {
    id: "anom-07", client_id: "1", source: "cfe", severity: "medium",
    category: "energy_waste",
    title: "Consumo base nocturno elevado",
    description: "Consumo base (23:00–06:00) promedio de 85 kW cuando la planta no opera. Posibles fugas: iluminación, aire comprimido, equipos en standby.",
    detected_at: "2026-04-09T10:00:00", period: "Ene 2026 – Abr 2026",
    financial_impact_monthly: 6200, status: "active",
  },
  {
    id: "anom-08", client_id: "1", source: "cfe", severity: "low",
    category: "billing_error",
    title: "Posible error en lectura de medidor",
    description: "El consumo de febrero 2026 muestra un incremento del 4% sin correlación con producción. Verificar lectura del medidor RPU.",
    detected_at: "2026-03-15T10:00:00", period: "Feb 2026",
    financial_impact_monthly: 1800, status: "acknowledged",
  },
];

// ─── Soluciones propuestas con ROI ───

const proposedSolutions: ProposedSolution[] = [
  {
    id: "sol-01", client_id: "1", anomaly_ids: ["anom-01"],
    type: "capacitor_bank", name: "Banco de capacitores automático 150 kVAR",
    description: "Instalación de banco de capacitores con control automático de 6 pasos para corregir FP de 0.81 a 0.95+. Elimina penalización CFE y genera bonificación.",
    urgency: "immediate", impact: "high",
    investment: 285000, monthly_savings: 18500, annual_savings: 222000,
    roi_months: 15.4, payback_date: "2027-07-15",
    co2_reduction_tons: 0, status: "proposed",
  },
  {
    id: "sol-02", client_id: "1", anomaly_ids: ["anom-02", "anom-03"],
    type: "bess", name: "Sistema BESS 200kWh peak shaving",
    description: "Batería de 200 kWh para recorte de picos de demanda y desplazamiento de consumo punta a intermedia. Reduce demanda facturada y costo en punta.",
    urgency: "short_term", impact: "high",
    investment: 1850000, monthly_savings: 14600, annual_savings: 175200,
    roi_months: 126.7, payback_date: "2036-10-01",
    co2_reduction_tons: 12, status: "proposed",
  },
  {
    id: "sol-03", client_id: "1", anomaly_ids: ["anom-03", "anom-07"],
    type: "solar_pv", name: "Sistema solar FV 180 kWp en techo",
    description: "Instalación de 180 kWp en techo de nave industrial. Cubre ~35% del consumo diurno, reduciendo consumo intermedia y base. Net billing con CFE.",
    urgency: "medium_term", impact: "high",
    investment: 3200000, monthly_savings: 42000, annual_savings: 504000,
    roi_months: 76.2, payback_date: "2032-08-01",
    co2_reduction_tons: 108, status: "proposed",
  },
  {
    id: "sol-04", client_id: "1", anomaly_ids: ["anom-04"],
    type: "vfd", name: "Filtros armónicos pasivos para VFDs",
    description: "Instalación de filtros LC sintonizados en 5° y 7° armónico para variadores existentes. Reduce THDi de 28% a <8%.",
    urgency: "immediate", impact: "medium",
    investment: 120000, monthly_savings: 4200, annual_savings: 50400,
    roi_months: 28.6, payback_date: "2028-08-01",
    co2_reduction_tons: 0, status: "proposed",
  },
  {
    id: "sol-05", client_id: "1", anomaly_ids: ["anom-07"],
    type: "led", name: "Retrofit LED + sensores de ocupación",
    description: "Sustitución de 420 luminarias HID/fluorescentes por LED con sensores de movimiento y programación horaria. Elimina consumo nocturno por iluminación.",
    urgency: "immediate", impact: "medium",
    investment: 380000, monthly_savings: 8500, annual_savings: 102000,
    roi_months: 44.7, payback_date: "2029-12-01",
    co2_reduction_tons: 28, status: "proposed",
  },
  {
    id: "sol-06", client_id: "1", anomaly_ids: ["anom-05"],
    type: "vfd", name: "Rebalanceo de cargas y redistribución",
    description: "Redistribución de circuitos entre fases del tablero principal. Incluye rediseño de alimentadores y reubicación de cargas monofásicas grandes.",
    urgency: "immediate", impact: "low",
    investment: 45000, monthly_savings: 3100, annual_savings: 37200,
    roi_months: 14.5, payback_date: "2027-06-15",
    co2_reduction_tons: 2, status: "proposed",
  },
];

// ─── Dispositivos de monitoreo ───

const monitoringDevices: MonitoringDevice[] = [
  {
    id: "dev-01", client_id: "1",
    name: "Medidor principal", model: "Carlo Gavazzi EM340",
    location: "Tablero general", status: "online",
    last_reading: {
      timestamp: "2026-04-09T14:32:00",
      voltage_l1: 218.4, voltage_l2: 221.7, voltage_l3: 219.8,
      current_l1: 28.3, current_l2: 42.1, current_l3: 35.6,
      power_kw: 267.8, reactive_kvar: 178.5, apparent_kva: 321.9,
      power_factor: 0.832, frequency_hz: 59.98,
      thd_v_pct: 4.2, thd_i_pct: 28.5,
    },
  },
  {
    id: "dev-02", client_id: "1",
    name: "Subestación producción", model: "Schneider PM5560",
    location: "Nave 1 - Producción", status: "online",
    last_reading: {
      timestamp: "2026-04-09T14:32:00",
      voltage_l1: 217.9, voltage_l2: 221.2, voltage_l3: 219.3,
      current_l1: 18.5, current_l2: 28.9, current_l3: 24.2,
      power_kw: 182.4, reactive_kvar: 125.3, apparent_kva: 221.3,
      power_factor: 0.824, frequency_hz: 59.98,
      thd_v_pct: 5.1, thd_i_pct: 32.1,
    },
  },
  {
    id: "dev-03", client_id: "1",
    name: "Oficinas y servicios", model: "Shelly Pro 3EM",
    location: "Tablero oficinas", status: "online",
    last_reading: {
      timestamp: "2026-04-09T14:31:00",
      voltage_l1: 219.1, voltage_l2: 222.0, voltage_l3: 220.1,
      current_l1: 9.8, current_l2: 13.2, current_l3: 11.4,
      power_kw: 85.4, reactive_kvar: 53.2, apparent_kva: 100.7,
      power_factor: 0.848, frequency_hz: 59.99,
      thd_v_pct: 3.1, thd_i_pct: 12.4,
    },
  },
];

// ─── Cliente completo ───

export const mockClientDetail: ClientDetail = {
  id: "1",
  name: "Industrias del Norte SA",
  rfc: "INO850101XX1",
  industry: "Manufactura",
  location: "Monterrey, NL",
  status: "active",
  tariff: "GDMTH",
  monthly_cost: 285000,
  created_at: "2025-08-15",
  contact_name: "Ing. Roberto Garza Treviño",
  contact_email: "r.garza@industriasdelnorte.mx",
  contact_phone: "+52 81 8123 4567",
  contracted_demand_kw: 300,
  supply_voltage: "220V trifásico",
  meter_number: "M-2847561",
  rpu: "RPU-812345678",
  invoices,
  anomalies,
  proposed_solutions: proposedSolutions,
  monitoring_devices: monitoringDevices,
};

// ─── Datos simulados de monitoreo últimas 24h ───

function generateLast24hReadings() {
  const readings: { time: string; power_kw: number; power_factor: number; demand_kw: number }[] = [];
  const now = new Date("2026-04-09T15:00:00");

  for (let i = 96; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 15 * 60 * 1000);
    const hour = t.getHours();

    // Patrón industrial: bajo en la noche, alto en el día
    let basePower = 85; // carga base nocturna
    if (hour >= 6 && hour < 8) basePower = 85 + (hour - 6) * 60; // rampa subida
    else if (hour >= 8 && hour < 18) basePower = 220 + Math.sin((hour - 8) * Math.PI / 10) * 60; // producción
    else if (hour >= 18 && hour < 21) basePower = 220 - (hour - 18) * 50; // rampa bajada
    else if (hour >= 21) basePower = 85;

    const noise = (Math.random() - 0.5) * 30;
    const power = Math.max(60, basePower + noise);

    // FP peor durante producción por motores inductivos
    let pf = 0.88;
    if (hour >= 8 && hour < 18) pf = 0.78 + Math.random() * 0.06;
    else pf = 0.85 + Math.random() * 0.05;

    readings.push({
      time: `${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}`,
      power_kw: Math.round(power * 10) / 10,
      power_factor: Math.round(pf * 1000) / 1000,
      demand_kw: Math.round((power / pf) * 10) / 10,
    });
  }
  return readings;
}

export const mockLive24h = generateLast24hReadings();

// ─── Resumen de costos por concepto (para gráfica de composición) ───

export const costBreakdown = invoices.map((inv) => ({
  period: inv.period,
  energy: inv.cost_energy,
  demand: inv.cost_demand,
  distribution: inv.cost_distribution + inv.cost_transmission,
  power_factor: inv.cost_power_factor,
  iva: inv.iva,
  total: inv.total_cost,
}));

// ─── ROI timeline para gráfica ───

export const roiTimeline = proposedSolutions
  .filter((s) => s.status === "proposed")
  .sort((a, b) => a.roi_months - b.roi_months)
  .map((s) => ({
    name: s.name.length > 30 ? s.name.slice(0, 30) + "…" : s.name,
    type: s.type,
    investment: s.investment,
    annual_savings: s.annual_savings,
    roi_months: s.roi_months,
    urgency: s.urgency,
    impact: s.impact,
  }));
