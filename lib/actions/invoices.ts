"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getInvoicesByOrg(orgId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("cfe_invoices")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: true });

  if (error) return { error: error.message };
  return { data: data ?? [] };
}

export async function deleteInvoice(invoiceId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const admin = createAdminClient();

  const { error } = await admin
    .from("cfe_invoices")
    .delete()
    .eq("id", invoiceId);

  if (error) return { error: error.message };
  return { success: true };
}
