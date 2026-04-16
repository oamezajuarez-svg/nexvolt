"use client";

import { Badge } from "@/components/ui/badge";
import { useClientData } from "./shared/client-data-context";
import { sections, type SectionId } from "./shared/types";

export function TabNavigation({
  section,
  setSection,
  selectedSolsCount,
}: {
  section: SectionId;
  setSection: (id: SectionId) => void;
  selectedSolsCount: number;
}) {
  const { client } = useClientData();

  return (
    <div className="flex gap-1 border-b border-nx-border overflow-x-auto">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => setSection(s.id)}
          className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            section === s.id
              ? "border-nx-primary text-nx-primary"
              : "border-transparent text-nx-text-muted hover:text-nx-text-secondary"
          }`}
        >
          {s.label}
          {s.id === "anomalies" && (
            <Badge variant="danger" className="ml-2">
              {client.anomalies.filter((a) => a.status === "active").length}
            </Badge>
          )}
          {s.id === "solutions" && (
            <Badge variant="accent" className="ml-2">
              {client.proposed_solutions.length}
            </Badge>
          )}
          {s.id === "simulator" && selectedSolsCount > 0 && (
            <Badge variant="accent" className="ml-2">{selectedSolsCount}</Badge>
          )}
        </button>
      ))}
    </div>
  );
}
