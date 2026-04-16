"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  AlertCircle,
  Trash2,
  Zap,
  Building2,
} from "lucide-react";
import { CFEUpload } from "@/components/cfe-upload";
import { getInvoicesByOrg, deleteInvoice } from "@/lib/actions/invoices";
import { createOrganizationForUser } from "@/lib/actions/auth";

interface SavedInvoice {
  id: string;
  period: string;
  total_cost: number | null;
  total_kwh: number | null;
}

function formatCurrency(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}

export function RecibosClient({
  orgId: initialOrgId,
  initialInvoices,
}: {
  orgId: string | null;
  initialInvoices: SavedInvoice[];
}) {
  const router = useRouter();
  const [orgId, setOrgId] = useState(initialOrgId);
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>(initialInvoices);

  // Org creation state
  const [companyName, setCompanyName] = useState("");
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    setCreatingOrg(true);
    setOrgError(null);

    const result = await createOrganizationForUser(companyName.trim());
    if (result.error) {
      setOrgError(result.error);
      setCreatingOrg(false);
      return;
    }
    setOrgId(result.orgId!);
    setCreatingOrg(false);
  };

  const refreshInvoices = async () => {
    if (!orgId) return;
    const invResult = await getInvoicesByOrg(orgId);
    if (invResult.data) {
      setSavedInvoices(
        invResult.data.map((inv) => ({
          id: inv.id,
          period: inv.period,
          total_cost: inv.total_cost,
          total_kwh: inv.total_kwh,
        }))
      );
    }
  };

  const handleDelete = async (invoiceId: string) => {
    await deleteInvoice(invoiceId);
    setSavedInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
  };

  // No org -- show creation form
  if (!orgId) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto mt-12">
          <Card className="!p-8">
            <div className="text-center mb-6">
              <Building2 className="h-12 w-12 text-nx-primary mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-nx-text">
                Configura tu empresa
              </h2>
              <p className="text-sm text-nx-text-muted mt-1">
                Para empezar tu diagnostico energetico, necesitamos el nombre de tu empresa
              </p>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <Input
                id="company"
                label="Nombre de tu empresa"
                type="text"
                placeholder="Industrias del Norte SA"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              {orgError && (
                <div className="rounded-lg bg-nx-danger-bg border border-nx-danger/20 px-4 py-2.5">
                  <p className="text-sm text-nx-danger">{orgError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={creatingOrg || !companyName.trim()}
                className="w-full"
                size="lg"
              >
                {creatingOrg ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Continuar"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-nx-text">Recibos de CFE</h1>
        <p className="text-sm text-nx-text-muted mt-1">
          Sube tus recibos de luz y el sistema extraera automaticamente todos los datos
        </p>
      </div>

      {/* Progress */}
      <Card className="!p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-nx-primary" />
            <span className="text-sm font-medium text-nx-text">
              Progreso: {savedInvoices.length} recibos cargados
            </span>
          </div>
          <Badge variant={savedInvoices.length >= 6 ? "accent" : "warning"}>
            {savedInvoices.length >= 6
              ? "Listo para analizar"
              : `Faltan ${Math.max(0, 6 - savedInvoices.length)} recibos (minimo 6 bimestrales)`}
          </Badge>
        </div>
        <div className="h-2 rounded-full bg-nx-surface overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              savedInvoices.length >= 6 ? "bg-nx-accent" : "bg-nx-primary"
            }`}
            style={{ width: `${Math.min(100, (savedInvoices.length / 6) * 100)}%` }}
          />
        </div>
      </Card>

      {/* Upload component */}
      <CFEUpload orgId={orgId} onSaved={refreshInvoices} />

      {/* Saved invoices table */}
      {savedInvoices.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-nx-text-secondary mb-3">
            Recibos guardados ({savedInvoices.length})
          </h2>
          <Card className="!p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-nx-border bg-nx-surface/30">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-nx-text-muted">Periodo</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-nx-text-muted">Consumo (kWh)</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-nx-text-muted">Total</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-nx-text-muted w-10"></th>
                </tr>
              </thead>
              <tbody>
                {savedInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-nx-border/50 last:border-0">
                    <td className="px-4 py-2.5 text-sm text-nx-text">{inv.period}</td>
                    <td className="px-4 py-2.5 text-sm text-nx-text text-right">
                      {inv.total_kwh?.toLocaleString() ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-sm font-medium text-nx-text text-right">
                      {formatCurrency(inv.total_cost)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="text-nx-text-muted hover:text-nx-danger transition-colors p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* CTA */}
      {savedInvoices.length >= 6 && (
        <Card className="!p-6 border-nx-accent/30 bg-nx-accent/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-nx-accent mb-1">
                Datos suficientes para el analisis
              </h3>
              <p className="text-xs text-nx-text-muted">
                Con {savedInvoices.length} recibos cargados, el sistema puede generar tu diagnostico completo.
              </p>
            </div>
            <Button size="lg" onClick={() => { window.location.href = `/clientes/${orgId}`; }}>
              <Zap className="h-4 w-4" /> Ver mi diagnostico
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
