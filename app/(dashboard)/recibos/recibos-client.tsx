"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Zap,
  X,
} from "lucide-react";
import { extractCFEInvoice, saveInvoice } from "@/lib/actions/extract-cfe";
import { getInvoicesByOrg, deleteInvoice } from "@/lib/actions/invoices";
import type { ExtractedInvoice } from "@/lib/actions/extract-cfe";

interface UploadedInvoice {
  id?: string;
  fileName: string;
  status: "extracting" | "review" | "saved" | "error";
  extracted?: ExtractedInvoice;
  error?: string;
}

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
  orgId,
  initialInvoices,
}: {
  orgId: string | null;
  initialInvoices: SavedInvoice[];
}) {
  const [uploads, setUploads] = useState<UploadedInvoice[]>([]);
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>(initialInvoices);
  const [dragOver, setDragOver] = useState(false);

  if (!orgId) {
    return (
      <div className="p-8">
        <Card className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-nx-warning mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-nx-text mb-2">
            Sin organizacion vinculada
          </h2>
          <p className="text-sm text-nx-text-muted">
            Tu cuenta no esta vinculada a una empresa. Contacta al administrador.
          </p>
        </Card>
      </div>
    );
  }

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const upload: UploadedInvoice = {
        fileName: file.name,
        status: "extracting",
      };

      setUploads((prev) => [...prev, upload]);

      const formData = new FormData();
      formData.append("file", file);

      const result = await extractCFEInvoice(formData);

      if (result.error || !result.data) {
        setUploads((prev) =>
          prev.map((u) =>
            u.fileName === file.name
              ? { ...u, status: "error", error: result.error }
              : u
          )
        );
        continue;
      }

      setUploads((prev) =>
        prev.map((u) =>
          u.fileName === file.name
            ? { ...u, status: "review", extracted: result.data }
            : u
        )
      );
    }
  };

  const handleSave = async (upload: UploadedInvoice) => {
    if (!upload.extracted) return;

    const result = await saveInvoice(orgId, upload.extracted);

    if (result.error) {
      setUploads((prev) =>
        prev.map((u) =>
          u.fileName === upload.fileName
            ? { ...u, status: "error", error: result.error }
            : u
        )
      );
      return;
    }

    setUploads((prev) =>
      prev.map((u) =>
        u.fileName === upload.fileName ? { ...u, status: "saved", id: result.id } : u
      )
    );

    // Refresh saved invoices
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

  const handleDismiss = (fileName: string) => {
    setUploads((prev) => prev.filter((u) => u.fileName !== fileName));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

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

      {/* Upload area */}
      <Card
        className={`!p-0 overflow-hidden transition-colors ${
          dragOver ? "border-nx-primary bg-nx-primary/5" : ""
        }`}
      >
        <label
          className="flex flex-col items-center justify-center py-12 px-8 cursor-pointer"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,image/png,image/jpeg"
            multiple
            className="hidden"
            onChange={handleInputChange}
          />
          <Upload
            className={`h-10 w-10 mb-4 transition-colors ${
              dragOver ? "text-nx-primary" : "text-nx-text-muted"
            }`}
          />
          <p className="text-sm font-medium text-nx-text mb-1">
            Arrastra tus recibos de CFE aqui
          </p>
          <p className="text-xs text-nx-text-muted mb-4">
            o haz click para seleccionar archivos (PDF, PNG, JPG)
          </p>
          <p className="text-xs text-nx-text-muted">
            Puedes subir varios recibos a la vez
          </p>
        </label>
      </Card>

      {/* Upload queue */}
      {uploads.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-nx-text-secondary">Procesando</h2>
          {uploads.map((upload) => (
            <Card key={upload.fileName} className="!p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-nx-text-muted flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-nx-text">{upload.fileName}</p>
                    {upload.status === "extracting" && (
                      <p className="text-xs text-nx-primary flex items-center gap-1 mt-0.5">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Extrayendo datos con IA...
                      </p>
                    )}
                    {upload.status === "error" && (
                      <p className="text-xs text-nx-danger mt-0.5">{upload.error}</p>
                    )}
                    {upload.status === "saved" && (
                      <p className="text-xs text-nx-accent flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                        Guardado
                      </p>
                    )}
                  </div>
                </div>
                {(upload.status === "error" || upload.status === "saved") && (
                  <button
                    onClick={() => handleDismiss(upload.fileName)}
                    className="text-nx-text-muted hover:text-nx-text transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Extracted data review */}
              {upload.status === "review" && upload.extracted && (
                <div className="border-t border-nx-border pt-3 mt-3">
                  <p className="text-xs font-medium text-nx-text-secondary mb-3">
                    Datos extraidos — verifica y confirma
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="rounded-lg bg-nx-surface/50 p-2.5">
                      <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">Periodo</p>
                      <p className="text-sm font-semibold text-nx-text mt-0.5">
                        {upload.extracted.period || "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-nx-surface/50 p-2.5">
                      <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">Total kWh</p>
                      <p className="text-sm font-semibold text-nx-text mt-0.5">
                        {upload.extracted.total_kwh?.toLocaleString() ?? "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-nx-surface/50 p-2.5">
                      <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">Demanda max</p>
                      <p className="text-sm font-semibold text-nx-text mt-0.5">
                        {upload.extracted.demand_max_kw ?? "—"} kW
                      </p>
                    </div>
                    <div className="rounded-lg bg-nx-surface/50 p-2.5">
                      <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">Factor potencia</p>
                      <p className="text-sm font-semibold text-nx-text mt-0.5">
                        {upload.extracted.power_factor ?? "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-nx-surface/50 p-2.5">
                      <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">Cargo energia</p>
                      <p className="text-sm font-semibold text-nx-text mt-0.5">
                        {formatCurrency(upload.extracted.cost_energy)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-nx-surface/50 p-2.5">
                      <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">Cargo FP</p>
                      <p className="text-sm font-semibold text-nx-text mt-0.5">
                        {formatCurrency(upload.extracted.cost_power_factor)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-nx-surface/50 p-2.5">
                      <p className="text-[10px] text-nx-text-muted uppercase tracking-wider">Tarifa</p>
                      <p className="text-sm font-semibold text-nx-text mt-0.5">
                        {upload.extracted.tariff ?? "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-nx-primary/5 border border-nx-primary/20 p-2.5">
                      <p className="text-[10px] text-nx-primary uppercase tracking-wider font-medium">Total</p>
                      <p className="text-sm font-bold text-nx-primary mt-0.5">
                        {formatCurrency(upload.extracted.total_cost)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(upload)}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Confirmar y guardar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDismiss(upload.fileName)}
                    >
                      Descartar
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

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
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-nx-text-muted">
                    Periodo
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-nx-text-muted">
                    Consumo (kWh)
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-nx-text-muted">
                    Total
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-nx-text-muted w-10">
                  </th>
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
                        title="Eliminar recibo"
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

      {/* Next step CTA */}
      {savedInvoices.length >= 6 && (
        <Card className="!p-6 border-nx-accent/30 bg-nx-accent/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-nx-accent mb-1">
                Datos suficientes para el analisis
              </h3>
              <p className="text-xs text-nx-text-muted">
                Con {savedInvoices.length} recibos cargados, el sistema puede generar tu diagnostico energetico completo.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => {
                window.location.href = `/clientes/${orgId}`;
              }}
            >
              <Zap className="h-4 w-4" />
              Ver mi diagnostico
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
