"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Where to go back
  const fromParam = searchParams.get("from");
  const tipoParam = searchParams.get("tipo") as "min" | "max" | null;
  const tipo = tipoParam === "max" ? "max" : "min";

  // Resolve back URL: use `from` if valid catalog/product path, else fallback to catalog
  function getBackUrl(): string {
    if (fromParam) {
      try {
        const decoded = decodeURIComponent(fromParam);
        // Only allow internal paths
        if (decoded.startsWith("/")) return decoded;
      } catch {}
    }
    return `/catalogo/${tipo}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email o contraseña incorrectos");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
      <div className="w-full max-w-sm">
        {/* Back button */}
        <button
          onClick={() => router.push(getBackUrl())}
          className="flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#1C1C1E] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </button>

        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold text-[#1C1C1E]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Muebles Fercho
          </h1>
          <p className="text-[#7A7A7A] mt-1 text-sm">Panel de administración</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mueblesfercho.com"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
