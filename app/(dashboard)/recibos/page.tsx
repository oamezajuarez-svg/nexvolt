import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { RecibosClient } from "./recibos-client";

export default async function RecibosPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const admin = createAdminClient();

  // Get user's org
  const { data: profile } = await admin
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  const orgId = profile?.organization_id ?? null;

  // Get existing invoices if org exists
  let savedInvoices: { id: string; period: string; total_cost: number | null; total_kwh: number | null }[] = [];
  if (orgId) {
    const { data } = await admin
      .from("cfe_invoices")
      .select("id, period, total_cost, total_kwh")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: true });

    savedInvoices = (data ?? []).map((inv) => ({
      id: inv.id,
      period: inv.period,
      total_cost: inv.total_cost,
      total_kwh: inv.total_kwh,
    }));
  }

  return <RecibosClient orgId={orgId} initialInvoices={savedInvoices} />;
}
