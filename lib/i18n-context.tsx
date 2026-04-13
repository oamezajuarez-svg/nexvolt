"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "es" | "en";

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

// ── Translations ──

const dict: Record<Lang, Record<string, string>> = {
  es: {
    // Sidebar
    "nav.dashboard": "Dashboard",
    "nav.clients": "Clientes",
    "nav.audits": "Auditorias",
    "nav.projects": "Proyectos",
    "nav.monitoring": "Monitoreo en vivo",
    "nav.reports": "Reportes",
    "nav.settings": "Configuracion",

    // Header
    "header.search": "Buscar clientes, proyectos...",
    "header.operator": "Operador",
    "header.theme": "Tema",
    "header.theme.dark": "Oscuro",
    "header.theme.light": "Claro",
    "header.theme.midnight": "Midnight",
    "header.language": "Idioma",
    "header.language.es": "Español",
    "header.language.en": "English",

    // Clients page
    "clients.title": "Clientes",
    "clients.subtitle": "Gestiona tu cartera de clientes industriales y comerciales.",
    "clients.search": "Buscar cliente...",
    "clients.total": "total",
    "clients.company": "Empresa",
    "clients.rfc": "RFC",
    "clients.industry": "Industria",
    "clients.location": "Ubicacion",
    "clients.tariff": "Tarifa",
    "clients.monthlyCost": "Costo mensual",
    "clients.status": "Estado",
    "clients.detail": "Ver detalle",
    "clients.notFound": "No se encontraron clientes.",
    "clients.active": "Activo",
    "clients.prospect": "Prospecto",
    "clients.inactive": "Inactivo",

    // Client detail tabs
    "tab.overview": "Resumen",
    "tab.cfe": "Recibos CFE",
    "tab.monitoring": "Monitoreo",
    "tab.anomalies": "Anomalias",
    "tab.solutions": "Soluciones y ROI",
    "tab.simulator": "Simulador de ahorro",

    // Common
    "common.back": "Volver a clientes",
    "common.annual": "año",
    "common.month": "mes",
    "common.months": "meses",
    "common.investment": "Inversion",
    "common.savings": "Ahorro",
    "common.total": "Total",

    // Homepage
    "home.hero": "Gestion Energetica Inteligente",
    "home.subtitle": "Optimiza el consumo electrico de tus clientes industriales. Analiza recibos CFE, detecta anomalias y genera soluciones con ROI calculado.",
    "home.cta.dashboard": "Ir al Dashboard",
    "home.cta.clients": "Ver Clientes",
    "home.stats.clients": "Clientes activos",
    "home.stats.projects": "Proyectos activos",
    "home.stats.savings": "Ahorro generado",
    "home.stats.co2": "CO2 evitado",
    "home.nav.dashboard.desc": "KPIs, tendencias de consumo y alertas en tiempo real",
    "home.nav.clients.desc": "Cartera de clientes industriales con analisis energetico",
    "home.nav.audits.desc": "Auditorias energeticas y analisis de recibos CFE",
    "home.nav.projects.desc": "Solar, BESS, capacitores, LED y mas soluciones",
    "home.nav.monitoring.desc": "Monitoreo IoT en tiempo real de calidad de energia",
    "home.nav.reports.desc": "Reportes ejecutivos y de ahorro para clientes",
  },
  en: {
    // Sidebar
    "nav.dashboard": "Dashboard",
    "nav.clients": "Clients",
    "nav.audits": "Audits",
    "nav.projects": "Projects",
    "nav.monitoring": "Live Monitoring",
    "nav.reports": "Reports",
    "nav.settings": "Settings",

    // Header
    "header.search": "Search clients, projects...",
    "header.operator": "Operator",
    "header.theme": "Theme",
    "header.theme.dark": "Dark",
    "header.theme.light": "Light",
    "header.theme.midnight": "Midnight",
    "header.language": "Language",
    "header.language.es": "Español",
    "header.language.en": "English",

    // Clients page
    "clients.title": "Clients",
    "clients.subtitle": "Manage your portfolio of industrial and commercial clients.",
    "clients.search": "Search client...",
    "clients.total": "total",
    "clients.company": "Company",
    "clients.rfc": "Tax ID",
    "clients.industry": "Industry",
    "clients.location": "Location",
    "clients.tariff": "Tariff",
    "clients.monthlyCost": "Monthly cost",
    "clients.status": "Status",
    "clients.detail": "View details",
    "clients.notFound": "No clients found.",
    "clients.active": "Active",
    "clients.prospect": "Prospect",
    "clients.inactive": "Inactive",

    // Client detail tabs
    "tab.overview": "Overview",
    "tab.cfe": "CFE Invoices",
    "tab.monitoring": "Monitoring",
    "tab.anomalies": "Anomalies",
    "tab.solutions": "Solutions & ROI",
    "tab.simulator": "Savings Simulator",

    // Common
    "common.back": "Back to clients",
    "common.annual": "year",
    "common.month": "month",
    "common.months": "months",
    "common.investment": "Investment",
    "common.savings": "Savings",
    "common.total": "Total",

    // Homepage
    "home.hero": "Intelligent Energy Management",
    "home.subtitle": "Optimize electrical consumption for your industrial clients. Analyze CFE invoices, detect anomalies, and generate solutions with calculated ROI.",
    "home.cta.dashboard": "Go to Dashboard",
    "home.cta.clients": "View Clients",
    "home.stats.clients": "Active clients",
    "home.stats.projects": "Active projects",
    "home.stats.savings": "Total savings",
    "home.stats.co2": "CO2 avoided",
    "home.nav.dashboard.desc": "KPIs, consumption trends and real-time alerts",
    "home.nav.clients.desc": "Industrial client portfolio with energy analysis",
    "home.nav.audits.desc": "Energy audits and CFE invoice analysis",
    "home.nav.projects.desc": "Solar, BESS, capacitors, LED and more solutions",
    "home.nav.monitoring.desc": "Real-time IoT power quality monitoring",
    "home.nav.reports.desc": "Executive and savings reports for clients",
  },
};

const I18nContext = createContext<I18nCtx>({
  lang: "es",
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem("nx-lang") as Lang | null;
    if (saved && ["es", "en"].includes(saved)) {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("nx-lang", l);
    document.documentElement.lang = l;
  };

  const t = (key: string) => dict[lang][key] ?? key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
