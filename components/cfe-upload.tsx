"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { extractCFEInvoice, saveInvoice } from "@/lib/actions/extract-cfe";
import type { ExtractedInvoice } from "@/lib/actions/extract-cfe";

interface UploadedInvoice {
  fileName: string;
  status: "extracting" | "review" | "saved" | "error";
  extracted?: ExtractedInvoice;
  error?: string;
}

function formatCurrency(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}

export function CFEUpload({
  orgId,
  onSaved,
}: {
  orgId: string;
  onSaved?: () => void;
}) {
  const [uploads, setUploads] = useState<UploadedInvoice[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      setUploads((prev) => [...prev, { fileName: file.name, status: "extracting" }]);

      const formData = new FormData();
      formData.append("file", file);
      const result = await extractCFEInvoice(formData);

      if (result.error || !result.data) {
        setUploads((prev) =>
          prev.map((u) =>
            u.fileName === file.name ? { ...u, status: "error", error: result.error } : u
          )
        );
        continue;
      }

      setUploads((prev) =>
        prev.map((u) =>
          u.fileName === file.name ? { ...u, status: "review", extracted: result.data } : u
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
          u.fileName === upload.fileName ? { ...u, status: "error", error: result.error } : u
        )
      );
      return;
    }

    setUploads((prev) =>
      prev.map((u) =>
        u.fileName === upload.fileName ? { ...u, status: "saved" } : u
      )
    );
    onSaved?.();
  };

  const handleDismiss = (fileName: string) => {
    setUploads((prev) => prev.filter((u) => u.fileName !== fileName));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <Card
        className={`!p-0 overflow-hidden transition-colors ${
          dragOver ? "border-nx-primary bg-nx-primary/5" : ""
        }`}
      >
        <label
          className="flex flex-col items-center justify-center py-8 px-6 cursor-pointer"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            accept=".pdf,image/png,image/jpeg"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
                e.target.value = "";
              }
            }}
          />
          <Upload className={`h-8 w-8 mb-3 ${dragOver ? "text-nx-primary" : "text-nx-text-muted"}`} />
          <p className="text-sm font-medium text-nx-text mb-1">
            Arrastra tus recibos de CFE aqui
          </p>
          <p className="text-xs text-nx-text-muted">
            PDF, PNG o JPG — puedes subir varios a la vez
          </p>
        </label>
      </Card>

      {/* Processing queue */}
      {uploads.map((upload) => (
        <Card key={upload.fileName} className="!p-4">
          <div className="flex items-start justify-between mb-2">
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
                    <CheckCircle2 className="h-3 w-3" /> Guardado
                  </p>
                )}
              </div>
            </div>
            {(upload.status === "error" || upload.status === "saved") && (
              <button onClick={() => handleDismiss(upload.fileName)} className="text-nx-text-muted hover:text-nx-text">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {upload.status === "review" && upload.extracted && (
            <div className="border-t border-nx-border pt-3 mt-2">
              <p className="text-xs font-medium text-nx-text-secondary mb-3">
                Datos extraidos — verifica y confirma
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {[
                  { label: "Periodo", value: upload.extracted.period || "—" },
                  { label: "Total kWh", value: upload.extracted.total_kwh?.toLocaleString() ?? "—" },
                  { label: "Demanda max", value: `${upload.extracted.demand_max_kw ?? "—"} kW` },
                  { label: "Factor potencia", value: String(upload.extracted.power_factor ?? "—") },
                  { label: "Cargo energia", value: formatCurrency(upload.extracted.cost_energy) },
                  { label: "Cargo FP", value: formatCurrency(upload.extracted.cost_power_factor) },
                  { label: "Tarifa", value: upload.extracted.tariff ?? "—" },
                  { label: "Total", value: formatCurrency(upload.extracted.total_cost), highlight: true },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-lg p-2 ${
                      item.highlight
                        ? "bg-nx-primary/5 border border-nx-primary/20"
                        : "bg-nx-surface/50"
                    }`}
                  >
                    <p className={`text-[10px] uppercase tracking-wider ${item.highlight ? "text-nx-primary font-medium" : "text-nx-text-muted"}`}>
                      {item.label}
                    </p>
                    <p className={`text-sm font-semibold mt-0.5 ${item.highlight ? "text-nx-primary" : "text-nx-text"}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSave(upload)}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Confirmar y guardar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDismiss(upload.fileName)}>
                  Descartar
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
