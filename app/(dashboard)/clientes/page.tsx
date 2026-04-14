"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Search, ArrowUpRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockClients } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";
import { useState } from "react";

export default function ClientesPage() {
  const [search, setSearch] = useState("");
  const { t } = useI18n();
  const router = useRouter();

  const statusLabels: Record<string, { label: string; variant: "accent" | "primary" | "default" }> = {
    active: { label: t("clients.active"), variant: "accent" },
    prospect: { label: t("clients.prospect"), variant: "primary" },
    inactive: { label: t("clients.inactive"), variant: "default" },
  };

  const filtered = mockClients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-nx-text tracking-tight flex items-center gap-3">
            <Building2 className="h-6 w-6 text-nx-primary" />
            {t("clients.title")}
          </h1>
          <p className="text-sm text-nx-text-muted mt-1">
            {t("clients.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="primary">{mockClients.length} {t("clients.total")}</Badge>
          <Link href="/clientes/nuevo">
            <Button variant="primary" size="sm">
              <Plus className="h-3.5 w-3.5" /> Nuevo Cliente
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-nx-text-muted" />
        <input
          type="text"
          placeholder={t("clients.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-nx-border bg-nx-surface pl-9 pr-4 py-2.5 text-sm text-nx-text placeholder:text-nx-text-muted focus:outline-none focus:border-nx-primary focus:ring-1 focus:ring-nx-primary-ring transition-colors"
        />
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nx-border text-left text-xs text-nx-text-muted">
                <th className="pb-3 font-medium">{t("clients.company")}</th>
                <th className="pb-3 font-medium">{t("clients.rfc")}</th>
                <th className="pb-3 font-medium">{t("clients.industry")}</th>
                <th className="pb-3 font-medium">{t("clients.location")}</th>
                <th className="pb-3 font-medium">{t("clients.tariff")}</th>
                <th className="pb-3 font-medium text-right">{t("clients.monthlyCost")}</th>
                <th className="pb-3 font-medium text-center">{t("clients.status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nx-border">
              {filtered.map((client) => {
                const st = statusLabels[client.status];
                return (
                  <tr
                    key={client.id}
                    onClick={() => router.push(`/clientes/${client.id}`)}
                    className="hover:bg-nx-surface/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 font-medium text-nx-text group-hover:text-nx-primary transition-colors">
                      <div className="flex items-center gap-2">
                        {client.name}
                        <ArrowUpRight className="h-3 w-3 text-nx-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="py-3 text-nx-text-muted font-mono text-xs">
                      {client.rfc}
                    </td>
                    <td className="py-3 text-nx-text-secondary">
                      {client.industry}
                    </td>
                    <td className="py-3 text-nx-text-secondary">
                      {client.location}
                    </td>
                    <td className="py-3">
                      <Badge>{client.tariff}</Badge>
                    </td>
                    <td className="py-3 text-right text-nx-text">
                      {formatCurrency(client.monthly_cost)}
                    </td>
                    <td className="py-3 text-center">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-nx-text-muted">
              {t("clients.notFound")}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
