"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getMyOrganization() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) {
    return { data: null };
  }

  const { data: org, error } = await admin
    .from("organizations")
    .select("*")
    .eq("id", profile.organization_id)
    .single();

  if (error) return { error: error.message };
  return { data: org };
}

export async function updateOrganization(
  orgId: string,
  updates: {
    name?: string;
    rfc?: string;
    industry?: string;
    location?: string;
    tariff?: string;
    contracted_demand_kw?: number;
    supply_voltage?: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
  }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No autenticado" };

  const admin = createAdminClient();

  const { error } = await admin
    .from("organizations")
    .update(updates)
    .eq("id", orgId);

  if (error) return { error: error.message };
  return { success: true };
}
