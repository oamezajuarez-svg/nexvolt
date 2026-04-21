"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { createOrganizationForUser } from "@/lib/actions/auth";
import { Logo } from "@/components/layout/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          company_name: companyName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // If email confirmation is required
    if (authData.user && !authData.session) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    // If auto-confirmed (email confirmation disabled), create the organization
    if (authData.session) {
      await createOrganizationForUser(companyName);
      router.refresh();
      router.push("/onboarding");
      return;
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nx-bg bg-grid">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-nx-accent/5 blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm mx-4">
          <div className="flex justify-center mb-10">
            <Logo size="lg" />
          </div>

          <div className="rounded-xl border border-nx-border bg-nx-card/80 backdrop-blur-sm p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-nx-accent mx-auto mb-4" />
            <h1 className="text-lg font-semibold text-nx-text mb-2">
              Cuenta creada
            </h1>
            <p className="text-sm text-nx-text-muted mb-6">
              Revisa tu email <strong className="text-nx-text">{email}</strong> para
              confirmar tu cuenta. Despues podras iniciar sesion.
            </p>
            <Link href="/login">
              <Button className="w-full" size="lg">
                Ir a iniciar sesion
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nx-bg bg-grid">
      {/* Radial glow behind card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-nx-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Logo size="lg" />
        </div>

        {/* Card */}
        <div className="rounded-xl border border-nx-border bg-nx-card/80 backdrop-blur-sm p-8">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-nx-text">Crear cuenta</h1>
            <p className="text-sm text-nx-text-muted mt-1">
              Comienza tu diagnostico energetico gratuito
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Tu nombre"
              type="text"
              placeholder="Juan Perez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <Input
              id="company"
              label="Nombre de tu empresa"
              type="text"
              placeholder="Industrias del Norte SA"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              autoComplete="organization"
            />
            <Input
              id="email"
              label="Email corporativo"
              type="email"
              placeholder="tu@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              id="password"
              label="Contraseña"
              type="password"
              placeholder="Minimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            {error && (
              <div className="rounded-lg bg-nx-danger-bg border border-nx-danger/20 px-4 py-2.5">
                <p className="text-sm text-nx-danger">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={loading || !name || !companyName || !email || !password} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-nx-text-muted">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-nx-primary hover:text-nx-primary/80 font-medium transition-colors"
              >
                Iniciar sesion
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-nx-text-muted mt-6">
          Nexvolt — Gestion Energetica Inteligente
        </p>
      </div>
    </div>
  );
}
