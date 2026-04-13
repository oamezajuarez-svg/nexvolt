"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, Moon, Sun, Palette, Globe, Check, Menu } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme-context";
import { useI18n, type Lang } from "@/lib/i18n-context";
import { useSidebar } from "@/lib/sidebar-context";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const { toggleSidebar } = useSidebar();
  const [showSettings, setShowSettings] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const themes: { id: Theme; label: string; icon: typeof Moon }[] = [
    { id: "dark", label: t("header.theme.dark"), icon: Moon },
    { id: "light", label: t("header.theme.light"), icon: Sun },
    { id: "midnight", label: t("header.theme.midnight"), icon: Palette },
  ];

  const langs: { id: Lang; label: string }[] = [
    { id: "es", label: t("header.language.es") },
    { id: "en", label: t("header.language.en") },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-nx-border bg-nx-bg/80 backdrop-blur-sm px-8">
      <div className="flex items-center gap-3">
        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-nx-text-secondary hover:bg-nx-surface hover:text-nx-text transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nx-text-muted" />
        <input
          type="text"
          placeholder={t("header.search")}
          className="w-full rounded-lg border border-nx-border bg-nx-surface py-2 pl-10 pr-4 text-sm text-nx-text placeholder:text-nx-text-muted focus:outline-none focus:ring-2 focus:ring-nx-primary-ring focus:border-nx-primary transition-colors"
        />
      </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Settings dropdown */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 rounded-lg border border-nx-border px-3 py-2 text-nx-text-secondary hover:bg-nx-surface hover:text-nx-text transition-colors"
          >
            {theme === "light" && <Sun className="h-4 w-4" />}
            {theme === "midnight" && <Palette className="h-4 w-4" />}
            {theme === "dark" && <Moon className="h-4 w-4" />}
            <span className="text-xs font-medium">{lang.toUpperCase()}</span>
          </button>

          {showSettings && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-nx-border bg-nx-card shadow-lg overflow-hidden z-50">
              {/* Theme */}
              <div className="p-3 border-b border-nx-border">
                <p className="text-[10px] font-semibold text-nx-text-muted uppercase tracking-wider mb-2">
                  {t("header.theme")}
                </p>
                <div className="space-y-0.5">
                  {themes.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => setTheme(th.id)}
                      className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                        theme === th.id
                          ? "bg-nx-primary-bg text-nx-primary"
                          : "text-nx-text-secondary hover:bg-nx-surface hover:text-nx-text"
                      }`}
                    >
                      <th.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{th.label}</span>
                      {theme === th.id && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="p-3">
                <p className="text-[10px] font-semibold text-nx-text-muted uppercase tracking-wider mb-2">
                  {t("header.language")}
                </p>
                <div className="space-y-0.5">
                  {langs.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLang(l.id)}
                      className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                        lang === l.id
                          ? "bg-nx-primary-bg text-nx-primary"
                          : "text-nx-text-secondary hover:bg-nx-surface hover:text-nx-text"
                      }`}
                    >
                      <Globe className="h-4 w-4" />
                      <span className="flex-1 text-left">{l.label}</span>
                      {lang === l.id && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-nx-text-secondary hover:bg-nx-surface hover:text-nx-text transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-nx-danger" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-nx-primary/20 flex items-center justify-center text-sm font-medium text-nx-primary">
            OA
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-nx-text">Oscar Amezquita</p>
            <p className="text-xs text-nx-text-muted">{t("header.operator")}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
