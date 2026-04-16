"use server";

import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ExtractedInvoice {
  period: string;
  consumption_base_kwh: number | null;
  consumption_intermedia_kwh: number | null;
  consumption_punta_kwh: number | null;
  total_kwh: number | null;
  demand_max_kw: number | null;
  demand_contracted_kw: number | null;
  demand_billed_kw: number | null;
  power_factor: number | null;
  power_factor_penalty_pct: number | null;
  cost_energy: number | null;
  cost_demand: number | null;
  cost_distribution: number | null;
  cost_transmission: number | null;
  cost_power_factor: number | null;
  subtotal: number | null;
  iva: number | null;
  total_cost: number | null;
  tariff: string | null;
  rpu: string | null;
  meter_number: string | null;
}

const EXTRACTION_PROMPT = `Eres un experto en recibos de CFE (Comision Federal de Electricidad) de Mexico.
Analiza este recibo de luz y extrae TODOS los datos disponibles en formato JSON.

El recibo puede ser bimestral o mensual dependiendo de la tarifa. Identifica el periodo de facturacion.

Extrae los siguientes campos. Si un campo no aparece en el recibo, usa null:

{
  "period": "Periodo de facturacion como texto, ej: 'Ene-Feb 2026' o 'Mar 2026'",
  "consumption_base_kwh": "Consumo en periodo base (kWh). En tarifas horarias aparece como 'Base'",
  "consumption_intermedia_kwh": "Consumo en periodo intermedio (kWh). En tarifas horarias aparece como 'Intermedia'",
  "consumption_punta_kwh": "Consumo en periodo punta (kWh). En tarifas horarias aparece como 'Punta'",
  "total_kwh": "Consumo total en kWh. Si no aparece explicitamente, suma base+intermedia+punta",
  "demand_max_kw": "Demanda maxima registrada en kW",
  "demand_contracted_kw": "Demanda contratada en kW",
  "demand_billed_kw": "Demanda facturable/facturada en kW",
  "power_factor": "Factor de potencia (decimal entre 0 y 1, ej: 0.85). Si aparece como porcentaje, dividir entre 100",
  "power_factor_penalty_pct": "Porcentaje de recargo (+) o bonificacion (-) por factor de potencia",
  "cost_energy": "Cargo por energia en MXN (pesos)",
  "cost_demand": "Cargo por demanda en MXN",
  "cost_distribution": "Cargo por distribucion en MXN",
  "cost_transmission": "Cargo por transmision en MXN",
  "cost_power_factor": "Cargo/bonificacion por factor de potencia en MXN. Positivo = penalizacion, negativo = bonificacion",
  "subtotal": "Subtotal antes de IVA en MXN",
  "iva": "IVA en MXN",
  "total_cost": "Total a pagar en MXN",
  "tariff": "Tipo de tarifa: GDMTH, GDMTO, DIST, PDBT, etc.",
  "rpu": "RPU (Registro Permanente Unico) del servicio",
  "meter_number": "Numero de medidor"
}

IMPORTANTE:
- Los montos son en pesos mexicanos (MXN), no incluyas el signo $
- El factor de potencia debe ser decimal (0.85, no 85%)
- Si el recibo tiene varias paginas, busca en todas
- Para tarifas no horarias (PDBT, por ejemplo), consumption_base=total, intermedia y punta son null
- Responde SOLO con el JSON, sin texto adicional ni markdown`;

export async function extractCFEInvoice(formData: FormData): Promise<{
  data?: ExtractedInvoice;
  error?: string;
}> {
  // Verify auth
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return { error: "No se recibio archivo" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { error: "Servicio de extraccion no configurado" };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const mediaType = file.type === "application/pdf" ? "application/pdf" as const
      : file.type === "image/png" ? "image/png" as const
      : file.type === "image/jpeg" ? "image/jpeg" as const
      : file.type === "image/webp" ? "image/webp" as const
      : null;

    if (!mediaType) {
      return { error: "Formato no soportado. Usa PDF, PNG o JPG." };
    }

    const client = new Anthropic({ apiKey });

    const content: Anthropic.ContentBlockParam[] = mediaType === "application/pdf"
      ? [
          {
            type: "document",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          { type: "text", text: EXTRACTION_PROMPT },
        ]
      : [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          { type: "text", text: EXTRACTION_PROMPT },
        ];

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { error: "No se pudo extraer informacion del recibo" };
    }

    // Parse JSON from response (handle potential markdown wrapping)
    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const extracted: ExtractedInvoice = JSON.parse(jsonStr);
    return { data: extracted };
  } catch (err) {
    console.error("CFE extraction error:", err);
    return { error: "Error al procesar el recibo. Intenta de nuevo." };
  }
}

export async function saveInvoice(
  organizationId: string,
  invoice: ExtractedInvoice,
  pdfUrl?: string
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("cfe_invoices")
    .upsert(
      {
        organization_id: organizationId,
        period: invoice.period,
        consumption_base_kwh: invoice.consumption_base_kwh,
        consumption_intermedia_kwh: invoice.consumption_intermedia_kwh,
        consumption_punta_kwh: invoice.consumption_punta_kwh,
        total_kwh: invoice.total_kwh,
        demand_max_kw: invoice.demand_max_kw,
        demand_contracted_kw: invoice.demand_contracted_kw,
        demand_billed_kw: invoice.demand_billed_kw,
        power_factor: invoice.power_factor,
        power_factor_penalty_pct: invoice.power_factor_penalty_pct,
        cost_energy: invoice.cost_energy,
        cost_demand: invoice.cost_demand,
        cost_distribution: invoice.cost_distribution,
        cost_transmission: invoice.cost_transmission,
        cost_power_factor: invoice.cost_power_factor,
        subtotal: invoice.subtotal,
        iva: invoice.iva,
        total_cost: invoice.total_cost,
        tariff: invoice.tariff,
        pdf_url: pdfUrl,
      },
      { onConflict: "organization_id,period" }
    )
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  // Update org tariff info if available
  if (invoice.tariff || invoice.rpu || invoice.meter_number || invoice.demand_contracted_kw) {
    await admin
      .from("organizations")
      .update({
        ...(invoice.tariff && { tariff: invoice.tariff }),
        ...(invoice.rpu && { rpu: invoice.rpu }),
        ...(invoice.meter_number && { meter_number: invoice.meter_number }),
        ...(invoice.demand_contracted_kw && { contracted_demand_kw: invoice.demand_contracted_kw }),
      })
      .eq("id", organizationId);
  }

  return { id: data.id };
}
