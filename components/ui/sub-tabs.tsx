"use client";

import { cn } from "@/lib/utils";

interface SubTab {
  id: string;
  label: string;
  count?: number;
}

interface SubTabsProps {
  tabs: SubTab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function SubTabs({ tabs, active, onChange, className }: SubTabsProps) {
  return (
    <div className={cn("flex gap-1 overflow-x-auto pb-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            active === tab.id
              ? "bg-nx-primary text-white"
              : "bg-nx-surface text-nx-text-muted hover:text-nx-text hover:bg-nx-surface/80"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "ml-1.5 px-1.5 py-0.5 rounded text-[10px]",
              active === tab.id ? "bg-white/20" : "bg-nx-border"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
