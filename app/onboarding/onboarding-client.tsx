"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Building2,
  Zap,
  Trash2,
  CheckCircle2,
  ArrowRight,
  FileText,
} from "lucide-react";
import { CFEUpload } from "@/components/cfe-upload";
import { getInvoicesByOrg, deleteInvoice } from "@/lib/actions/invoices";
import { createOrganizationForUser } from "@/lib/actions/auth";
import { runAnalysis } from "@/lib/engine/analyze";

interface SavedInvoice {
  id: string;
  period: string;
  total_cost: number | null;
  total_kwh: number | null;
}

function formatCurrency(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

export function OnboardingClient({
  orgId: initialOrgId,
  initialInvoices,
}: {
  orgId: string | null;
  initialInvoices: SavedInvoice[];
}) {
  const [orgId, setOrgId] = useState(initialOrgId);
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>(initialInvoices);
  const [companyName, setCompanyName] = useState("");
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ anomalyCount: number; solutionCount: number } | null>(null);

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

  const handleAnalyze = async () => {
    if (!orgId) return;
    setAnalyzing(true);
    const result = await runAnalysis(orgId);
    setAnalysisResult({ anomalyCount: result.anomalyCount, solutionCount: result.solutionCount });
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-nx-bg bg-grid">
      {/* Clean top bar */}
      <div className="border-b border-nx-border bg-nx-bg/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between h-14 px-6">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            {orgId && (
              <span className="text-xs text-nx-text-muted">
                {savedInvoices.length}/6 recibos
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* ── Step 1: Company name ── */}
        {!orgId && (
          <>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-nx-primary/30 bg-nx-primary/5 px-3 py-1 mb-4">
                <span className="text-xs font-semibold text-nx-primary">Paso 1 de 2</span>
              </div>
              <h1 className="text-2xl font-bold text-nx-text">
                Nombre de tu empresa
              </h1>
              <p className="text-sm text-nx-text-muted mt-2">
                Para personalizar tu diagnostico energetico
              </p>
            </div>

            <Card className="max-w-md mx-auto !p-8">
              <form onSubmit={handleCreateOrg} className="space-y-4">
                <Input
                  id="company"
                  label="Empresa o planta"
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
                <Button type="submit" disabled={creatingOrg || !companyName.trim()} className="w-full" size="lg">
                  {creatingOrg ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Creando...</>
                  ) : (
                    <>Continuar <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </Card>
          </>
        )}

        {/* ── Step 2: Upload bills ── */}
        {orgId && !analysisResult && (
          <>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-nx-primary/30 bg-nx-primary/5 px-3 py-1 mb-4">
                <span className="text-xs font-semibold text-nx-primary">Paso 2 de 2</span>
              </div>
              <h1 className="text-2xl font-bold text-nx-text">
                Sube tus recibos de CFE
              </h1>
              <p className="text-sm text-nx-text-muted mt-2">
                Arrastra los PDF de tus ultimos 6 recibos bimestrales. La IA extrae los datos automaticamente.
              </p>
            </div>

            {/* Progress */}
            <Card className="!p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-nx-primary" />
                  <span className="text-sm font-medium text-nx-text">
                    {savedInvoices.length} de 6 recibos
                  </span>
                </div>
                <Badge variant={savedInvoices.length >= 6 ? "accent" : savedInvoices.length >= 3 ? "warning" : "default"}>
                  {savedInvoices.length >= 6
                    ? "Listo para analizar"
                    : savedInvoices.length >= 3
                    ? "Minimo alcanzado"
                    : `Faltan ${Math.max(0, 3 - savedInvoices.length)} mas (minimo 3)`}
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

            {/* Upload */}
            <CFEUpload orgId={orgId} onSaved={refreshInvoices} />

            {/* Saved invoices */}
            {savedInvoices.length > 0 && (
              <Card className="!p-0 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-nx-border bg-nx-surface/30">
                  <p className="text-xs font-medium text-nx-text-secondary">
                    Recibos guardados ({savedInvoices.length})
                  </p>
                </div>
                <table className="w-full">
                  <tbody>
                    {savedInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-nx-border/50 last:border-0">
                        <td className="px-4 py-2.5 text-sm text-nx-text">{inv.period}</td>
                        <td className="px-4 py-2.5 text-sm text-nx-text text-right">
                          {inv.total_kwh?.toLocaleString() ?? "—"} kWh
                        </td>
                        <td className="px-4 py-2.5 text-sm font-medium text-nx-text text-right">
                          {formatCurrency(inv.total_cost)}
                        </td>
                        <td className="px-4 py-2.5 text-right w-10">
                          <button onClick={() => handleDelete(inv.id)} className="text-nx-text-muted hover:text-nx-danger transition-colors p-1">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {/* Analyze CTA */}
            {savedInvoices.length >= 3 && (
              <Card className="!p-6 border-nx-accent/30 bg-nx-accent/5 text-center">
                <Zap className="h-8 w-8 text-nx-accent mx-auto mb-3" />
                <h3 className="text-base font-semibold text-nx-text mb-1">
                  {savedInvoices.length >= 6
                    ? "Datos completos. Ejecuta tu diagnostico."
                    : `${savedInvoices.length} recibos listos. Puedes ejecutar el diagnostico ahora o subir mas para mayor precision.`}
                </h3>
                <p className="text-xs text-nx-text-muted mb-4">
                  El motor analiza factor de potencia, demanda, consumo y costos para detectar anomalias y calcular soluciones con ROI
                </p>
                <Button size="lg" disabled={analyzing} onClick={handleAnalyze}>
                  {analyzing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Analizando tus datos...</>
                  ) : (
                    <><Zap className="h-4 w-4" /> Ejecutar diagnostico</>
                  )}
                </Button>
              </Card>
            )}
          </>
        )}

        {/* ── Results ── */}
        {analysisResult && orgId && (
          <div className="text-center space-y-6">
            <div>
              <CheckCircle2 className="h-16 w-16 text-nx-accent mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-nx-text">
                Tu diagnostico esta listo
              </h1>
              <p className="text-sm text-nx-text-muted mt-2 max-w-md mx-auto">
                Analizamos {savedInvoices.length} recibos de CFE y encontramos:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <Card className="!p-4 text-center">
                <p className="text-3xl font-bold text-nx-warning">{analysisResult.anomalyCount}</p>
                <p className="text-xs text-nx-text-muted mt-1">Anomalias detectadas</p>
              </Card>
              <Card className="!p-4 text-center">
                <p className="text-3xl font-bold text-nx-accent">{analysisResult.solutionCount}</p>
                <p className="text-xs text-nx-text-muted mt-1">Soluciones propuestas</p>
              </Card>
            </div>

            <Link
              href={`/clientes/${orgId}`}
              className="inline-flex items-center gap-2 rounded-xl bg-nx-primary px-8 py-4 text-base font-semibold text-white hover:bg-nx-primary-dim transition-colors glow-primary"
            >
              Ver mi diagnostico completo
              <ArrowRight className="h-5 w-5" />
            </Link>

            <p className="text-xs text-nx-text-muted">
              Incluye graficas de consumo, anomalias, soluciones con ROI, simulador y mas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
