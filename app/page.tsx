"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { useI18n } from "@/lib/i18n-context";
import { useTheme } from "@/lib/theme-context";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  FolderKanban,
  Activity,
  FileBarChart,
  ArrowRight,
  Zap,
  TrendingDown,
  Leaf,
  Users,
  Moon,
  Sun,
  Palette,
  Globe,
} from "lucide-react";

const stats = [
  { key: "home.stats.clients", value: "8", icon: Users, color: "text-nx-primary", bg: "bg-nx-primary-bg" },
  { key: "home.stats.projects", value: "12", icon: FolderKanban, color: "text-nx-primary", bg: "bg-nx-primary-bg" },
  { key: "home.stats.savings", value: "$2.4M", icon: TrendingDown, color: "text-nx-accent", bg: "bg-nx-accent-bg" },
  { key: "home.stats.co2", value: "148 ton", icon: Leaf, color: "text-nx-accent", bg: "bg-nx-accent-bg" },
];

const navCards = [
  { href: "/dashboard", icon: LayoutDashboard, titleKey: "nav.dashboard", descKey: "home.nav.dashboard.desc", color: "text-nx-primary", glow: "hover:shadow-[0_0_30px_rgba(14,165,233,0.15)]" },
  { href: "/clientes", icon: Building2, titleKey: "nav.clients", descKey: "home.nav.clients.desc", color: "text-nx-primary", glow: "hover:shadow-[0_0_30px_rgba(14,165,233,0.15)]" },
  { href: "/auditorias", icon: ClipboardCheck, titleKey: "nav.audits", descKey: "home.nav.audits.desc", color: "text-nx-accent", glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]" },
  { href: "/proyectos", icon: FolderKanban, titleKey: "nav.projects", descKey: "home.nav.projects.desc", color: "text-nx-accent", glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]" },
  { href: "/monitoreo", icon: Activity, titleKey: "nav.monitoring", descKey: "home.nav.monitoring.desc", color: "text-nx-warning", glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]" },
  { href: "/reportes", icon: FileBarChart, titleKey: "nav.reports", descKey: "home.nav.reports.desc", color: "text-nx-warning", glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]" },
];

export default function HomePage() {
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();

  const themeIcons = { dark: Moon, light: Sun, midnight: Palette };
  const ThemeIcon = themeIcons[theme];
  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "midnight" : "dark";

  return (
    <div className="min-h-screen bg-nx-bg bg-grid">
      {/* ── Top nav ── */}
      <nav className="sticky top-0 z-40 border-b border-nx-border/50 bg-nx-bg/60 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl flex items-center justify-between h-16 px-6">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(nextTheme)}
              className="rounded-lg p-2 text-nx-text-muted hover:text-nx-text hover:bg-nx-surface transition-colors"
              title={`Theme: ${nextTheme}`}
            >
              <ThemeIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-nx-text-muted hover:text-nx-text hover:bg-nx-surface transition-colors flex items-center gap-1.5"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang.toUpperCase()}
            </button>
            <Link
              href="/dashboard"
              className="ml-2 rounded-lg bg-nx-primary px-4 py-2 text-sm font-medium text-white hover:bg-nx-primary-dim transition-colors"
            >
              {t("home.cta.dashboard")}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-nx-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full bg-nx-accent/5 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center px-6 pt-24 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-nx-border bg-nx-surface/50 px-4 py-1.5 mb-8">
            <Zap className="h-3.5 w-3.5 text-nx-accent" />
            <span className="text-xs font-medium text-nx-text-secondary">Nexvolt v2.0</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1]">
            <span className="bg-gradient-to-r from-nx-primary via-nx-accent to-nx-primary bg-clip-text text-transparent">
              {t("home.hero")}
            </span>
          </h1>

          <p className="mt-6 text-lg text-nx-text-secondary max-w-2xl mx-auto leading-relaxed">
            {t("home.subtitle")}
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-nx-primary px-6 py-3 text-sm font-semibold text-white hover:bg-nx-primary-dim transition-colors glow-primary"
            >
              {t("home.cta.dashboard")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/clientes"
              className="inline-flex items-center gap-2 rounded-xl border border-nx-border bg-nx-card px-6 py-3 text-sm font-semibold text-nx-text hover:bg-nx-surface transition-colors"
            >
              {t("home.cta.clients")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="rounded-xl border border-nx-border bg-nx-card p-5 text-center hover:border-nx-border-hover transition-colors"
            >
              <div className={`inline-flex rounded-lg p-2.5 ${stat.bg} mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-nx-text">{stat.value}</p>
              <p className="text-xs text-nx-text-muted mt-1">{t(stat.key)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Navigation grid ── */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {navCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group rounded-xl border border-nx-border bg-nx-card p-6 hover:border-nx-border-hover transition-all duration-300 ${card.glow}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-lg bg-nx-surface p-2.5">
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <ArrowRight className="h-4 w-4 text-nx-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-sm font-semibold text-nx-text mb-1">
                {t(card.titleKey)}
              </h3>
              <p className="text-xs text-nx-text-muted leading-relaxed">
                {t(card.descKey)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-nx-border py-8 text-center">
        <p className="text-xs text-nx-text-muted">
          Nexvolt v2.0 — Plataforma de gestion energetica
        </p>
      </footer>
    </div>
  );
}
