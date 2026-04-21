"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { useTheme } from "@/lib/theme-context";
import {
  ArrowRight,
  Zap,
  FileText,
  BarChart3,
  Shield,
  Clock,
  TrendingDown,
  CheckCircle2,
  Upload,
  Moon,
  Sun,
  Palette,
} from "lucide-react";

export default function HomePage() {
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
            >
              <ThemeIcon className="h-4 w-4" />
            </button>
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-nx-text-secondary hover:text-nx-text hover:bg-nx-surface transition-colors"
            >
              Iniciar sesion
            </Link>
            <Link
              href="/registro"
              className="rounded-lg bg-nx-primary px-4 py-2 text-sm font-medium text-white hover:bg-nx-primary-dim transition-colors"
            >
              Diagnostico gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-nx-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full bg-nx-accent/5 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center px-6 pt-24 pb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-nx-accent/30 bg-nx-accent/5 px-4 py-1.5 mb-8">
            <Zap className="h-3.5 w-3.5 text-nx-accent" />
            <span className="text-xs font-medium text-nx-accent">Diagnostico energetico con IA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            <span className="text-nx-text">Sube tus recibos de CFE.</span>
            <br />
            <span className="bg-gradient-to-r from-nx-primary via-nx-accent to-nx-primary bg-clip-text text-transparent">
              Recibe tu diagnostico en minutos.
            </span>
          </h1>

          <p className="mt-6 text-lg text-nx-text-secondary max-w-2xl mx-auto leading-relaxed">
            Con solo <strong className="text-nx-text">6 recibos bimestrales de CFE</strong>, nuestro motor de IA analiza
            tu consumo, detecta anomalias y genera soluciones con ROI calculado. Sin instalar nada.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-xl bg-nx-primary px-8 py-4 text-base font-semibold text-white hover:bg-nx-primary-dim transition-colors glow-primary"
            >
              Comenzar diagnostico gratis
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/clientes/1"
              className="inline-flex items-center gap-2 rounded-xl border border-nx-border bg-nx-card px-8 py-4 text-base font-semibold text-nx-text hover:bg-nx-surface transition-colors"
            >
              Ver ejemplo real
            </Link>
          </div>

          <p className="mt-4 text-xs text-nx-text-muted">
            Sin costo. Sin tarjeta de credito. Resultados inmediatos.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-center text-sm font-semibold text-nx-text-muted uppercase tracking-wider mb-10">
          Como funciona
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              icon: Upload,
              title: "Sube tus recibos",
              description: "Arrastra los PDF de tus ultimos 6 recibos bimestrales de CFE. La IA extrae automaticamente los 20+ campos de cada recibo.",
              color: "text-nx-primary",
              bg: "bg-nx-primary/10",
              border: "border-nx-primary/20",
            },
            {
              step: "2",
              icon: BarChart3,
              title: "Analisis automatico",
              description: "El motor detecta anomalias: factor de potencia bajo, excesos de demanda, consumo en horario punta, desperdicios de energia.",
              color: "text-nx-accent",
              bg: "bg-nx-accent/10",
              border: "border-nx-accent/20",
            },
            {
              step: "3",
              icon: TrendingDown,
              title: "Soluciones con ROI",
              description: "Recibe recomendaciones a la medida: banco de capacitores, solar, almacenamiento, LED. Cada una con inversion, ahorro mensual y retorno.",
              color: "text-amber-400",
              bg: "bg-amber-400/10",
              border: "border-amber-400/20",
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`relative rounded-xl border ${item.border} bg-nx-card p-6 hover:bg-nx-surface/50 transition-colors`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`rounded-lg ${item.bg} p-2.5`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className={`text-2xl font-bold ${item.color}`}>{item.step}</span>
              </div>
              <h3 className="text-base font-semibold text-nx-text mb-2">{item.title}</h3>
              <p className="text-sm text-nx-text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="border-t border-nx-border bg-nx-surface/20">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center text-2xl font-bold text-nx-text mb-3">
            Que incluye tu diagnostico
          </h2>
          <p className="text-center text-sm text-nx-text-muted mb-12 max-w-lg mx-auto">
            Todo basado en normas mexicanas (CONUEE, NOM, SEMARNAT) y estandares internacionales (ASHRAE, IEEE, LEED, ISO 50001)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: FileText, title: "Analisis de 20+ variables por recibo", desc: "Consumo por periodo horario, demanda, factor de potencia, desglose de costos" },
              { icon: Shield, title: "Deteccion de anomalias", desc: "Factor de potencia bajo, excesos de demanda, picos de consumo, errores de facturacion" },
              { icon: TrendingDown, title: "Soluciones con ROI real", desc: "Capacitores, solar, almacenamiento, LED, migracion MEM. Inversion y retorno calculados" },
              { icon: BarChart3, title: "Simulador de escenarios", desc: "Compara costos actuales vs. implementar 1, 2 o 3 soluciones combinadas" },
              { icon: CheckCircle2, title: "Ruta a certificaciones", desc: "Avance hacia CONUEE, LEED v4.1, ISO 50001. Beneficios fiscales Art. 34 LISR" },
              { icon: Clock, title: "Resultados en minutos", desc: "No semanas de consultoria. Sube los PDF, confirma los datos, ejecuta el analisis" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-nx-border bg-nx-card p-5 hover:border-nx-border-hover transition-colors">
                <item.icon className="h-5 w-5 text-nx-primary mb-3" />
                <h3 className="text-sm font-semibold text-nx-text mb-1">{item.title}</h3>
                <p className="text-xs text-nx-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="rounded-2xl border border-nx-primary/20 bg-gradient-to-b from-nx-primary/5 to-transparent p-10">
          <Zap className="h-10 w-10 text-nx-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-nx-text mb-3">
            Conoce cuanto esta perdiendo tu planta
          </h2>
          <p className="text-sm text-nx-text-muted mb-8 max-w-md mx-auto">
            La mayoria de las plantas industriales en Mexico pagan entre 8% y 25% de mas en su factura electrica.
            Descubrelo en minutos con tus propios datos.
          </p>
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 rounded-xl bg-nx-primary px-8 py-4 text-base font-semibold text-white hover:bg-nx-primary-dim transition-colors glow-primary"
          >
            Subir mis recibos de CFE
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-nx-text-muted">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-nx-accent" /> Gratis</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-nx-accent" /> Sin instalar nada</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-nx-accent" /> Resultados inmediatos</span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-nx-border py-8">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between">
          <p className="text-xs text-nx-text-muted">
            Nexvolt — Diagnostico energetico inteligente para la industria mexicana
          </p>
          <div className="flex items-center gap-4">
            <Link href="/clientes/1" className="text-xs text-nx-text-muted hover:text-nx-text transition-colors">
              Ver demo
            </Link>
            <Link href="/login" className="text-xs text-nx-text-muted hover:text-nx-text transition-colors">
              Iniciar sesion
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
