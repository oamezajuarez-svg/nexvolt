"use client";

import { useState } from "react";
import { client } from "./_components/shared/config";
import type { SectionId } from "./_components/shared/types";
import { ClientHeader } from "./_components/client-header";
import { DataSourcesSummary } from "./_components/data-sources-summary";
import { TabNavigation } from "./_components/tab-navigation";
import { OverviewSection } from "./_components/tabs/overview-tab";
import { CFESection } from "./_components/tabs/cfe-invoices-tab";
import { MonitoringSection } from "./_components/tabs/monitoring-tab";
import { AnomaliesSection } from "./_components/tabs/anomalies-tab";
import { SolutionsSection } from "./_components/tabs/solutions-tab";
import { SimulatorSection } from "./_components/tabs/simulator-tab";
import { PlantProfileSection } from "./_components/tabs/plant-profile-tab";
import { EquipmentSection } from "./_components/tabs/equipment-tab";
import { EnergyBalanceSection } from "./_components/tabs/energy-balance-tab";
import { CertificationsSection } from "./_components/tabs/certifications-tab";

export default function ClientDetailPage() {
  const [section, setSection] = useState<SectionId>("overview");
  const [selectedSols, setSelectedSols] = useState<Set<string>>(new Set());

  return (
    <div className="p-8 space-y-6">
      <ClientHeader client={client} />

      <DataSourcesSummary />

      <TabNavigation
        section={section}
        setSection={setSection}
        selectedSolsCount={selectedSols.size}
      />

      {/* Tab content */}
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
  );
}
