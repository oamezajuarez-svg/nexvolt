"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // TODO: Replace with Supabase auth
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (email && password) {
        router.push("/dashboard");
      } else {
        setError("Ingresa email y contraseña");
      }
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-lg font-semibold text-nx-text">Iniciar sesión</h1>
            <p className="text-sm text-nx-text-muted mt-1">
              Accede a tu plataforma de gestión energética
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
                "Iniciar sesión"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-nx-text-muted mt-6">
          Nexvolt — Gestión Energética Inteligente
        </p>
      </div>
    </div>
  );
}
