"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import LoadingButton from "@/components/admin/LoadingButton";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Loader2, Save, Check, Megaphone, MapPin, Upload,
  Trash2, GripVertical, Settings, Share2, Map, ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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
  latitude: string;
  longitude: string;
}

interface StorePhoto {
  id: number;
  url: string;
  path: string;
  caption: string | null;
  order: number;
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<SiteConfig>({
    businessName: "", phone: "", whatsapp: "", email: "", address: "",
    instagram: "", facebook: "", tiktok: "", promoBannerText: "", promoBannerActive: false,
    latitude: "", longitude: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photos, setPhotos] = useState<StorePhoto[]>([]);
  const [uploading, setUploading] = useState(false);

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
        latitude: data.latitude != null ? String(data.latitude) : "",
        longitude: data.longitude != null ? String(data.longitude) : "",
      });
      setLoading(false);
    });
    fetch("/api/store-photos").then((r) => r.json()).then(setPhotos).catch(() => {});
  }, []);

  function set(field: keyof SiteConfig, value: string | boolean) {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }

  async function save_config() {
    setSaving(true);
    const lat = config.latitude.trim();
    const lng = config.longitude.trim();
    const payload = {
      ...config,
      latitude: lat === "" ? null : Number(lat),
      longitude: lng === "" ? null : Number(lng),
    };
    if ((lat !== "" && Number.isNaN(payload.latitude as number)) ||
        (lng !== "" && Number.isNaN(payload.longitude as number))) {
      setSaving(false);
      toast.error("Latitud/Longitud inválidas");
      return;
    }
    const res = await fetch("/api/configuracion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Configuración guardada");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else toast.error("Error al guardar");
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "tienda-ubicacion");
        const up = await fetch("/api/upload", { method: "POST", body: fd });
        if (!up.ok) throw new Error("Error al subir");
        const { url, path } = await up.json();
        const res = await fetch("/api/store-photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, path }),
        });
        if (!res.ok) throw new Error("Error al guardar");
        const newPhoto = await res.json();
        setPhotos((prev) => [...prev, newPhoto]);
      }
      toast.success("Fotos subidas");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function updatePhoto(id: number, data: { caption?: string | null; order?: number }) {
    setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, ...data } : p));
    await fetch(`/api/store-photos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function deletePhoto(id: number) {
    if (!confirm("¿Eliminar esta foto?")) return;
    const res = await fetch(`/api/store-photos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Foto eliminada");
    } else toast.error("Error al eliminar");
  }

  function movePhoto(idx: number, dir: -1 | 1) {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= photos.length) return;
    const reordered = [...photos];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    setPhotos(reordered);
    reordered.forEach((p, i) => {
      if (p.order !== i) {
        fetch(`/api/store-photos/${p.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        });
      }
    });
  }

  if (loading) return (
    <>
      <AdminTopBar title="Configuración" />
      <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
    </>
  );

  return (
    <>
      <AdminTopBar title="Configuración" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          title="Configuración"
          description="Datos del negocio, redes sociales, banner y ubicación."
          icon={Settings}
        />

        <Tabs defaultValue="general" className="max-w-2xl">
          <TabsList className="mb-6">
            <TabsTrigger value="general"><Settings className="w-3.5 h-3.5" /> General</TabsTrigger>
            <TabsTrigger value="social"><Share2 className="w-3.5 h-3.5" /> Redes</TabsTrigger>
            <TabsTrigger value="banner"><Megaphone className="w-3.5 h-3.5" /> Banner</TabsTrigger>
            <TabsTrigger value="location"><Map className="w-3.5 h-3.5" /> Ubicación</TabsTrigger>
            <TabsTrigger value="photos"><ImageIcon className="w-3.5 h-3.5" /> Fotos</TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general" className="space-y-4">
            <div className="admin-card p-5 space-y-4">
              <FormField label="Nombre del negocio" htmlFor="cfg-name">
                <Input id="cfg-name" value={config.businessName} onChange={(e) => set("businessName", e.target.value)} className="h-9" />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Teléfono" htmlFor="cfg-phone">
                  <Input id="cfg-phone" value={config.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+54 11 1234-5678" className="h-9" />
                </FormField>
                <FormField label="WhatsApp" htmlFor="cfg-wa" hint="Con código de país, sin + ni espacios">
                  <Input id="cfg-wa" value={config.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="5491112345678" className="h-9" />
                </FormField>
              </div>
              <FormField label="Email" htmlFor="cfg-email">
                <Input id="cfg-email" type="email" value={config.email} onChange={(e) => set("email", e.target.value)} placeholder="info@mueblesfercho.com" className="h-9" />
              </FormField>
              <FormField label="Dirección" htmlFor="cfg-addr">
                <Input id="cfg-addr" value={config.address} onChange={(e) => set("address", e.target.value)} placeholder="Av. Ejemplo 1234" className="h-9" />
              </FormField>
            </div>
          </TabsContent>

          {/* Social */}
          <TabsContent value="social" className="space-y-4">
            <div className="admin-card p-5 space-y-4">
              <FormField label="Instagram" htmlFor="cfg-ig" hint="Usuario sin @">
                <Input id="cfg-ig" value={config.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="mueblesfercho" className="h-9" />
              </FormField>
              <FormField label="Facebook" htmlFor="cfg-fb" hint="URL o nombre de usuario">
                <Input id="cfg-fb" value={config.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="mueblesfercho" className="h-9" />
              </FormField>
              <FormField label="TikTok" htmlFor="cfg-tt" hint="Usuario sin @">
                <Input id="cfg-tt" value={config.tiktok} onChange={(e) => set("tiktok", e.target.value)} placeholder="mueblesfercho" className="h-9" />
              </FormField>
            </div>
          </TabsContent>

          {/* Banner */}
          <TabsContent value="banner" className="space-y-4">
            <div className="admin-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Banner de promoción</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{config.promoBannerActive ? "Activo" : "Inactivo"}</span>
                  <Switch
                    checked={config.promoBannerActive}
                    onCheckedChange={(v) => set("promoBannerActive", v)}
                  />
                </div>
              </div>
              <FormField label="Texto del banner" htmlFor="cfg-banner">
                <Input
                  id="cfg-banner"
                  value={config.promoBannerText}
                  onChange={(e) => set("promoBannerText", e.target.value)}
                  placeholder="Ej: Enero: 15% de descuento en comedores"
                  className="h-9"
                />
              </FormField>
              {config.promoBannerText && (
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-500 font-medium">Vista previa</p>
                  <div className={`relative overflow-hidden rounded-lg transition-opacity ${config.promoBannerActive ? "opacity-100" : "opacity-50"}`}>
                    <div className="bg-gradient-to-r from-[#C9A96E] via-[#d4b97e] to-[#C9A96E] py-2.5 px-5">
                      <div className="flex items-center justify-center gap-2">
                        <Megaphone className="w-3.5 h-3.5 text-[#1C1C1E]/70 shrink-0" />
                        <p className="text-[#1C1C1E] text-sm font-medium text-center">{config.promoBannerText}</p>
                      </div>
                    </div>
                    {!config.promoBannerActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                        <span className="text-xs font-medium text-slate-500 bg-white/90 px-2 py-0.5 rounded">Inactivo</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Location */}
          <TabsContent value="location" className="space-y-4">
            <div className="admin-card p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-[#C9A96E]" />
                <h3 className="text-sm font-semibold text-slate-900">Ubicación de la tienda</h3>
              </div>
              <p className="text-xs text-slate-500">
                Coordenadas para el mapa embebido. Pegá valores de Google Maps (click derecho → coordenadas).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Latitud" htmlFor="cfg-lat">
                  <Input
                    id="cfg-lat"
                    value={config.latitude}
                    onChange={(e) => set("latitude", e.target.value)}
                    placeholder="-16.349304079912745"
                    inputMode="decimal"
                    className="h-9"
                  />
                </FormField>
                <FormField label="Longitud" htmlFor="cfg-lng">
                  <Input
                    id="cfg-lng"
                    value={config.longitude}
                    onChange={(e) => set("longitude", e.target.value)}
                    placeholder="-72.1910353459628"
                    inputMode="decimal"
                    className="h-9"
                  />
                </FormField>
              </div>
              {config.latitude && config.longitude && (
                <div className="rounded-lg overflow-hidden border border-slate-200 h-48">
                  <iframe
                    title="Mapa de la tienda"
                    className="w-full h-full"
                    src={`https://www.google.com/maps?q=${config.latitude},${config.longitude}&z=17&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          {/* Photos */}
          <TabsContent value="photos" className="space-y-4">
            <div className="admin-card p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Fotos de cómo llegar</h3>
                <label className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  uploading ? "bg-slate-100 text-slate-400" : "bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white"
                }`}>
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {uploading ? "Subiendo..." : "Subir fotos"}
                  <input type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={handleUpload} />
                </label>
              </div>
              <p className="text-xs text-slate-500">
                Fotos de referencia del trayecto y fachada. Se muestran como galería arriba del footer.
              </p>
              {photos.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-200 rounded-lg">
                  No hay fotos aún.
                </div>
              ) : (
                <ul className="space-y-2">
                  {photos.map((p, idx) => (
                    <li key={p.id} className="flex items-center gap-3 p-2 border border-slate-200/70 rounded-lg">
                      <div className="flex flex-col gap-0.5 text-slate-400">
                        <button type="button" onClick={() => movePhoto(idx, -1)} disabled={idx === 0} className="disabled:opacity-30 hover:text-slate-800 text-xs" aria-label="Subir">▲</button>
                        <GripVertical className="w-3 h-3 mx-auto" />
                        <button type="button" onClick={() => movePhoto(idx, 1)} disabled={idx === photos.length - 1} className="disabled:opacity-30 hover:text-slate-800 text-xs" aria-label="Bajar">▼</button>
                      </div>
                      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        <Image src={p.url} alt={p.caption ?? ""} fill className="object-cover" sizes="56px" />
                      </div>
                      <Input
                        defaultValue={p.caption ?? ""}
                        onBlur={(e) => updatePhoto(p.id, { caption: e.target.value || null })}
                        placeholder="Descripción (opcional)"
                        className="flex-1 h-9"
                      />
                      <button
                        type="button"
                        onClick={() => deletePhoto(p.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Save button */}
        <div className="max-w-2xl mt-6 sticky bottom-4">
          <LoadingButton
            onClick={save_config}
            loading={saving}
            loadingText="Guardando..."
            className={`transition-all duration-300 shadow-lg ${
              saved
                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                : "bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white"
            }`}
          >
            {saved ? <><Check className="w-4 h-4" /> Guardado</> : <><Save className="w-4 h-4" /> Guardar cambios</>}
          </LoadingButton>
        </div>
      </main>
    </>
  );
}
