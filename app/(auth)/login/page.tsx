"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/layout/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos"
          : authError.message
      );
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/onboarding");
  };

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
            <h1 className="text-lg font-semibold text-nx-text">Iniciar sesion</h1>
            <p className="text-sm text-nx-text-muted mt-1">
              Accede a tu plataforma de gestion energetica
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error && (
              <div className="rounded-lg bg-nx-danger-bg border border-nx-danger/20 px-4 py-2.5">
                <p className="text-sm text-nx-danger">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Iniciar sesion"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-nx-text-muted">
              ¿No tienes cuenta?{" "}
              <Link
                href="/registro"
                className="text-nx-primary hover:text-nx-primary/80 font-medium transition-colors"
              >
                Crear cuenta
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
