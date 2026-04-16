"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";
import { useSidebar } from "@/lib/sidebar-context";
import { Logo } from "./logo";
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  FolderKanban,
  Activity,
  FileBarChart,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Plus,
  FileText,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", i18nKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/recibos", label: "Recibos CFE", icon: FileText },
  { href: "/clientes", i18nKey: "nav.clients", icon: Building2 },
  { href: "/auditorias", i18nKey: "nav.audits", icon: ClipboardCheck },
  { href: "/proyectos", i18nKey: "nav.projects", icon: FolderKanban },
  { href: "/monitoreo", i18nKey: "nav.monitoring", icon: Activity },
  { href: "/reportes", i18nKey: "nav.reports", icon: FileBarChart },
  { href: "/configuracion", i18nKey: "nav.settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-nx-border bg-nx-bg transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo — links to homepage */}
      <Link
        href="/"
        className={cn(
          "flex h-16 items-center border-b border-nx-border shrink-0 hover:bg-nx-surface/50 transition-colors",
          collapsed ? "px-3 justify-center" : "px-6"
        )}
      >
        <Logo collapsed={collapsed} />
      </Link>

      {/* New pilot button */}
      <div className={cn("px-2 pt-4 pb-2", collapsed && "px-1.5")}>
        <Link
          href="/clientes/nuevo"
          className={cn(
            "flex items-center gap-2 rounded-lg bg-nx-primary text-white text-xs font-medium transition-all hover:bg-nx-primary-dim",
            collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Nuevo Piloto</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const displayLabel = "label" in item ? item.label : t(item.i18nKey);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? displayLabel : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
                collapsed
                  ? "justify-center px-0 py-2.5"
                  : "px-3 py-2.5",
                active
                  ? "bg-nx-primary-bg text-nx-primary"
                  : "text-nx-text-secondary hover:bg-nx-surface hover:text-nx-text"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <span className="truncate">{displayLabel}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-nx-border p-2">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm text-nx-text-muted hover:bg-nx-surface hover:text-nx-text transition-colors"
          title={collapsed ? "Expandir" : "Colapsar"}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="text-xs">Colapsar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
