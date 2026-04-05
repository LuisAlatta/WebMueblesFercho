"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Check, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SiteConfig {
  businessName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  promoBannerText: string;
  promoBannerActive: boolean;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<SiteConfig>({
    businessName: "", phone: "", whatsapp: "", email: "", address: "",
    instagram: "", facebook: "", tiktok: "", promoBannerText: "", promoBannerActive: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/configuracion").then((r) => r.json()).then((data) => {
      setConfig({
        businessName: data.businessName ?? "",
        phone: data.phone ?? "",
        whatsapp: data.whatsapp ?? "",
        email: data.email ?? "",
        address: data.address ?? "",
        instagram: data.instagram ?? "",
        facebook: data.facebook ?? "",
        tiktok: data.tiktok ?? "",
        promoBannerText: data.promoBannerText ?? "",
        promoBannerActive: data.promoBannerActive ?? false,
      });
      setLoading(false);
    });
  }, []);

  function set(field: keyof SiteConfig, value: string | boolean) {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/configuracion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Configuración guardada");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      toast.error("Error al guardar");
    }
  }

  if (loading) return (
    <>
      <AdminTopBar title="Configuración" />
      <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#7A7A7A]" /></div>
    </>
  );

  return (
    <>
      <AdminTopBar title="Configuración del sitio" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl space-y-6">

          {/* Datos generales */}
          <motion.section
            custom={0}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-4"
          >
            <h2 className="font-semibold text-[#1C1C1E]">Datos del negocio</h2>
            <div className="space-y-2">
              <Label>Nombre del negocio</Label>
              <Input value={config.businessName} onChange={(e) => set("businessName", e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input value={config.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+54 11 1234-5678" />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp <span className="font-normal text-[#7A7A7A]">(con código de país)</span></Label>
                <Input value={config.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="5491112345678" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={config.email} onChange={(e) => set("email", e.target.value)} placeholder="info@mueblesfercho.com" />
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input value={config.address} onChange={(e) => set("address", e.target.value)} placeholder="Av. Ejemplo 1234, Buenos Aires" />
            </div>
          </motion.section>

          {/* Redes sociales */}
          <motion.section
            custom={1}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-4"
          >
            <h2 className="font-semibold text-[#1C1C1E]">Redes sociales</h2>
            <div className="space-y-2">
              <Label>Instagram (usuario sin @)</Label>
              <Input value={config.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="mueblesfercho" />
            </div>
            <div className="space-y-2">
              <Label>Facebook (URL o usuario)</Label>
              <Input value={config.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="mueblesfercho" />
            </div>
            <div className="space-y-2">
              <Label>TikTok (usuario sin @)</Label>
              <Input value={config.tiktok} onChange={(e) => set("tiktok", e.target.value)} placeholder="mueblesfercho" />
            </div>
          </motion.section>

          {/* Banner promo */}
          <motion.section
            custom={2}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#1C1C1E]">Banner de promoción</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#7A7A7A]">{config.promoBannerActive ? "Activo" : "Inactivo"}</span>
                <Switch
                  checked={config.promoBannerActive}
                  onCheckedChange={(v) => set("promoBannerActive", v)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Texto del banner</Label>
              <Input
                value={config.promoBannerText}
                onChange={(e) => set("promoBannerText", e.target.value)}
                placeholder="Ej: Enero: 15% de descuento en comedores — Consultar por WhatsApp"
              />
            </div>
            {/* Promo banner preview */}
            {config.promoBannerText ? (
              <div className="space-y-2">
                <p className="text-xs text-[#7A7A7A] font-medium">Vista previa</p>
                <div
                  className={`relative overflow-hidden rounded-lg transition-opacity ${
                    config.promoBannerActive ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <div className="bg-gradient-to-r from-[#C9A96E] via-[#d4b97e] to-[#C9A96E] py-2.5 px-5">
                    <div className="flex items-center justify-center gap-2">
                      <Megaphone className="w-3.5 h-3.5 text-[#1C1C1E]/70 shrink-0" />
                      <p className="text-[#1C1C1E] text-sm font-medium text-center">
                        {config.promoBannerText}
                      </p>
                    </div>
                  </div>
                  {!config.promoBannerActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                      <span className="text-xs font-medium text-[#7A7A7A] bg-white/90 px-2 py-0.5 rounded">
                        Inactivo
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </motion.section>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <Button
              onClick={save}
              disabled={saving}
              className={`transition-all duration-300 ${
                saved
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : "bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white"
              }`}
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</>
              ) : saved ? (
                <><Check className="w-4 h-4 mr-2" />Guardado</>
              ) : (
                <><Save className="w-4 h-4 mr-2" />Guardar cambios</>
              )}
            </Button>
          </motion.div>
        </div>
      </main>
    </>
  );
}
