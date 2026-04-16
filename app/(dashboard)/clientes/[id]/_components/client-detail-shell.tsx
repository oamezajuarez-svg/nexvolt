"use client";

import { useState } from "react";
import type { ClientDetail } from "@/lib/types";
import type { SectionId } from "./shared/types";
import { ClientDataProvider } from "./shared/client-data-context";
import { ClientHeader } from "./client-header";
import { DataSourcesSummary } from "./data-sources-summary";
import { TabNavigation } from "./tab-navigation";
import { OverviewSection } from "./tabs/overview-tab";
import { CFESection } from "./tabs/cfe-invoices-tab";
import { MonitoringSection } from "./tabs/monitoring-tab";
import { AnomaliesSection } from "./tabs/anomalies-tab";
import { SolutionsSection } from "./tabs/solutions-tab";
import { SimulatorSection } from "./tabs/simulator-tab";
import { PlantProfileSection } from "./tabs/plant-profile-tab";
import { EquipmentSection } from "./tabs/equipment-tab";
import { EnergyBalanceSection } from "./tabs/energy-balance-tab";
import { CertificationsSection } from "./tabs/certifications-tab";

export function ClientDetailShell({
  client,
  orgId,
}: {
  client: ClientDetail;
  orgId: string;
}) {
  const [section, setSection] = useState<SectionId>("overview");
  const [selectedSols, setSelectedSols] = useState<Set<string>>(new Set());

  return (
    <ClientDataProvider client={client} orgId={orgId}>
      <div className="p-8 space-y-6">
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
    </ClientDataProvider>
  );
}
