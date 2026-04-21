import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const admin = createAdminClient();

      // Check if user has an organization, create one if signup included company_name
      const { data: profile } = await admin
        .from("profiles")
        .select("organization_id")
        .eq("id", data.session.user.id)
        .single();

      if (profile && !profile.organization_id) {
        const companyName = data.session.user.user_metadata?.company_name;
        if (companyName) {
          const { data: org } = await admin
            .from("organizations")
            .insert({
              name: companyName,
              contact_name: data.session.user.user_metadata?.name || "",
              contact_email: data.session.user.email || "",
              status: "prospect",
            })
            .select("id")
            .single();

          if (org) {
            await admin
              .from("profiles")
              .update({ organization_id: org.id })
              .eq("id", data.session.user.id);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${origin}/login`);
}
