"use client";

import { useState } from "react";
import Link from "next/link";
import type { ClientDetail } from "@/lib/types";
import type { SectionId } from "@/app/(dashboard)/clientes/[id]/_components/shared/types";
import { ClientDataProvider } from "@/app/(dashboard)/clientes/[id]/_components/shared/client-data-context";
import { ClientHeader } from "@/app/(dashboard)/clientes/[id]/_components/client-header";
import { DataSourcesSummary } from "@/app/(dashboard)/clientes/[id]/_components/data-sources-summary";
import { TabNavigation } from "@/app/(dashboard)/clientes/[id]/_components/tab-navigation";
import { OverviewSection } from "@/app/(dashboard)/clientes/[id]/_components/tabs/overview-tab";
import { CFESection } from "@/app/(dashboard)/clientes/[id]/_components/tabs/cfe-invoices-tab";
import { MonitoringSection } from "@/app/(dashboard)/clientes/[id]/_components/tabs/monitoring-tab";
import { AnomaliesSection } from "@/app/(dashboard)/clientes/[id]/_components/tabs/anomalies-tab";
import { SolutionsSection } from "@/app/(dashboard)/clientes/[id]/_components/tabs/solutions-tab";
import { SimulatorSection } from "@/app/(dashboard)/clientes/[id]/_components/tabs/simulator-tab";
import { PlantProfileSection } from "@/app/(dashboard)/clientes/[id]/_components/tabs/plant-profile-tab";
import { EquipmentSection } from "@/app/(dashboard)/clientes/[id]/_components/tabs/equipment-tab";
import { EnergyBalanceSection } from "@/app/(dashboard)/clientes/[id]/_components/tabs/energy-balance-tab";
import { CertificationsSection } from "@/app/(dashboard)/clientes/[id]/_components/tabs/certifications-tab";
import { Logo } from "@/components/layout/logo";
import { ArrowRight, ArrowLeft, Zap } from "lucide-react";

export function DemoShell({ client }: { client: ClientDetail }) {
  const [section, setSection] = useState<SectionId>("overview");
  const [selectedSols, setSelectedSols] = useState<Set<string>>(new Set());

  return (
    <ClientDataProvider client={client} orgId="demo">
      <div className="min-h-screen bg-nx-bg">
        {/* Top bar */}
        <div className="sticky top-0 z-40 border-b border-nx-border bg-nx-bg/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-nx-text-muted hover:text-nx-text transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <Logo size="sm" />
              </Link>
              <div className="h-5 w-px bg-nx-border" />
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-nx-warning/10 border border-nx-warning/30 px-2.5 py-0.5 text-[10px] font-semibold text-nx-warning uppercase tracking-wider">
                  Demo
                </span>
                <span className="text-sm text-nx-text-muted">
                  Ejemplo con datos ficticios de una planta industrial
                </span>
              </div>
            </div>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-lg bg-nx-primary px-4 py-2 text-sm font-semibold text-white hover:bg-nx-primary-dim transition-colors"
            >
              <Zap className="h-4 w-4" />
              Quiero esto para mi planta
            </Link>
          </div>
        </div>

        {/* Client detail content */}
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <ClientHeader client={client} />
          <DataSourcesSummary />
          <TabNavigation
            section={section}
            setSection={setSection}
            selectedSolsCount={selectedSols.size}
          />

          {section === "overview" && <OverviewSection />}
          {section === "cfe" && <CFESection />}
          {section === "monitoring" && <MonitoringSection />}
          {section === "anomalies" && <AnomaliesSection />}
          {section === "solutions" && <SolutionsSection />}
          {section === "simulator" && (
            <SimulatorSection selected={selectedSols} setSelected={setSelectedSols} />
          )}
          {section === "plant" && <PlantProfileSection />}
          {section === "equipment" && <EquipmentSection />}
          {section === "balance" && <EnergyBalanceSection />}
          {section === "certifications" && <CertificationsSection />}
        </div>

        {/* Sticky CTA at bottom */}
        <div className="sticky bottom-0 z-40 border-t border-nx-border bg-nx-bg/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
            <p className="text-sm text-nx-text-muted">
              <strong className="text-nx-text">Esto es un ejemplo.</strong>{" "}
              Sube tus recibos de CFE y obtendras el mismo analisis para tu planta.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-lg bg-nx-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-nx-accent/90 transition-colors flex-shrink-0"
            >
              Obtener mi diagnostico
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </ClientDataProvider>
  );
}
