"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createOrganizationForUser(companyName: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado" };
  }

  // Use admin client to bypass RLS for org creation during signup
  const admin = createAdminClient();

  // Check if user already has an org
  const { data: profile } = await admin
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (profile?.organization_id) {
    return { orgId: profile.organization_id };
  }

  // Create the organization
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({
      name: companyName,
      contact_name: user.user_metadata?.name || "",
      contact_email: user.email || "",
      status: "prospect",
    })
    .select("id")
    .single();

  if (orgError) {
    return { error: orgError.message };
  }

  // Link profile to org
  await admin
    .from("profiles")
    .update({ organization_id: org.id })
    .eq("id", user.id);

  return { orgId: org.id };
}
