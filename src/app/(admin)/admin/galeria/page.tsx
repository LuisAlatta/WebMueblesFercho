"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface GalleryPhoto {
  id: number; url: string; publicId: string; title: string | null;
  description: string | null; isActive: boolean;
}

export default function GaleriaPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ url: "", publicId: "", title: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const data = await fetch("/api/galeria").then((r) => r.json());
    setPhotos(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!form.url || !form.publicId) { toast.error("URL y publicId requeridos"); return; }
    setSaving(true);
    await fetch("/api/galeria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: photos.length }),
    });
    setSaving(false);
    toast.success("Foto agregada");
    setForm({ url: "", publicId: "", title: "" });
    load();
  }

  async function toggle(photo: GalleryPhoto) {
    await fetch("/api/galeria", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: photo.id, isActive: !photo.isActive }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm("¿Eliminar esta foto?")) return;
    await fetch("/api/galeria", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast.success("Foto eliminada"); load();
  }

  return (
    <>
      <AdminTopBar title="Galería de trabajos" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 max-w-lg space-y-4">
          <h2 className="font-semibold text-[#1C1C1E]">Agregar foto</h2>
          <p className="text-xs text-[#7A7A7A]">Próximamente: subida directa drag-and-drop con Cloudinary. Por ahora, pegá la URL de Cloudinary.</p>
          <div className="space-y-2">
            <Label>URL de la imagen</Label>
            <Input value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://res.cloudinary.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Public ID (Cloudinary)</Label>
            <Input value={form.publicId} onChange={(e) => setForm((p) => ({ ...p, publicId: e.target.value }))} placeholder="muebles-fercho/foto-1" />
          </div>
          <div className="space-y-2">
            <Label>Título (opcional)</Label>
            <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Dormitorio en nogal" />
          </div>
          <Button onClick={add} disabled={saving} className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Agregar foto
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#7A7A7A]" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className={`relative group rounded-xl overflow-hidden border ${photo.isActive ? "border-gray-100" : "border-gray-200 opacity-50"}`}>
                <div className="aspect-[4/3] bg-gray-100 relative">
                  <Image src={photo.url} alt={photo.title ?? "Foto"} fill className="object-cover" />
                </div>
                {photo.title && <p className="text-xs text-[#2C2C2C] px-2 py-1.5 truncate">{photo.title}</p>}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggle(photo)}
                    className="bg-white text-xs px-2 py-1 rounded shadow text-[#7A7A7A] hover:text-[#1C1C1E]"
                  >
                    {photo.isActive ? "Ocultar" : "Mostrar"}
                  </button>
                  <button
                    onClick={() => remove(photo.id)}
                    className="bg-white text-red-400 hover:text-red-600 p-1 rounded shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {photos.length === 0 && (
              <p className="col-span-full text-center text-sm text-[#7A7A7A] py-8">No hay fotos en la galería</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}
