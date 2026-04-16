"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Eye, EyeOff, AlertCircle, Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true
    );
  }, []);

  const fromParam = searchParams.get("from");
  const tipoParam = searchParams.get("tipo") as "min" | "max" | null;
  const tipo = tipoParam === "max" ? "max" : "min";

  function getBackUrl(): string {
    if (fromParam) {
      try {
        const decoded = decodeURIComponent(fromParam);
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

  const hasError = Boolean(error);

  // ── PWA Standalone: dark full-screen app login ──
  if (isStandalone) {
    return (
      <div className="min-h-screen flex flex-col bg-[#1C1C1E] text-white safe-area-inset">
        {/* Top spacer — pushes content to visual center */}
        <div className="flex-1 min-h-[60px]" />

        <div className="px-6 pb-8 w-full max-w-sm mx-auto">
          {/* Logo + branding */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-[22px] bg-white/10 backdrop-blur-sm ring-1 ring-white/10 flex items-center justify-center mb-5 overflow-hidden shadow-2xl">
              <Image
                src="/images/favicon fercho.png"
                alt="Muebles Fercho"
                width={52}
                height={52}
                className="object-contain"
                priority
              />
            </div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Muebles Fercho
            </h1>
            <p className="text-white/40 text-sm mt-1">Panel de administración</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-white/60">
                Email
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (hasError) setError(""); }}
                  placeholder="admin@mueblesfercho.com"
                  required
                  autoFocus
                  aria-invalid={hasError || undefined}
                  className="h-12 pl-10 text-sm bg-white/[0.07] border-white/[0.1] text-white placeholder:text-white/30 rounded-xl focus-visible:ring-[#C9A96E]/40 focus-visible:border-[#C9A96E]/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-white/60">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (hasError) setError(""); }}
                  placeholder="••••••••"
                  required
                  aria-invalid={hasError || undefined}
                  className="h-12 pl-10 pr-11 text-sm bg-white/[0.07] border-white/[0.1] text-white placeholder:text-white/30 rounded-xl focus-visible:ring-[#C9A96E]/40 focus-visible:border-[#C9A96E]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-white/30 hover:text-white/70 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-[#C9A96E] hover:bg-[#B89A5E] text-[#1C1C1E] text-sm font-semibold rounded-xl shadow-lg shadow-[#C9A96E]/20 transition-all disabled:opacity-60"
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

        {/* Bottom safe area + copyright */}
        <div className="flex-1 min-h-[40px] flex items-end justify-center pb-6">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} Muebles Fercho</p>
        </div>
      </div>
    );
  }

  // ── Web browser: light login ──
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF9F7] via-white to-[#F3EFE6] px-4 py-10 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-[420px] h-[420px] bg-[#1C1C1E]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="w-full max-w-sm relative">
        <button
          onClick={() => router.push(getBackUrl())}
          className="flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#1C1C1E] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Volver al catálogo
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-[0_8px_24px_-8px_rgba(201,169,110,0.35)] ring-1 ring-[#C9A96E]/20 flex items-center justify-center mb-4 overflow-hidden">
            <Image
              src="/images/favicon fercho.png"
              alt="Muebles Fercho"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <h1
            className="text-2xl font-bold text-[#1C1C1E] text-center tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Muebles Fercho
          </h1>
          <p className="text-[#7A7A7A] mt-1 text-sm">Panel de administración</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)] ring-1 ring-black/[0.04] p-7">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-[#1C1C1E]">
                Email
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (hasError) setError(""); }}
                  placeholder="admin@mueblesfercho.com"
                  required
                  autoFocus
                  aria-invalid={hasError || undefined}
                  className="h-10 pl-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-[#1C1C1E]">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (hasError) setError(""); }}
                  placeholder="••••••••"
                  required
                  aria-invalid={hasError || undefined}
                  className="h-10 pl-9 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#9CA3AF] hover:text-[#1C1C1E] hover:bg-gray-100 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-10 bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white text-sm font-medium rounded-lg shadow-sm transition-all disabled:opacity-60"
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

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          © {new Date().getFullYear()} Muebles Fercho
        </p>
      </div>
    </div>
  );
}
