"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import SingleImageUpload from "@/components/admin/SingleImageUpload";
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
    const res = await fetch("/api/galeria");
    if (res.ok) {
      const data = await res.json();
      setPhotos(data);
    } else {
      toast.error("Error al cargar la galería");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!form.url || !form.publicId) { toast.error("Debes subir una imagen primero"); return; }
    setSaving(true);
    const res = await fetch("/api/galeria", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: photos.length }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Foto agregada");
      setForm({ url: "", publicId: "", title: "" });
      load();
    } else {
      toast.error("Error al agregar la foto");
    }
  }

  async function toggle(photo: GalleryPhoto) {
    const res = await fetch("/api/galeria", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: photo.id, isActive: !photo.isActive }),
    });
    if (res.ok) {
      load();
    } else {
      toast.error("Error al actualizar");
    }
  }

  async function remove(id: number) {
    if (!confirm("¿Eliminar esta foto?")) return;
    const res = await fetch("/api/galeria", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success("Foto eliminada");
      load();
    } else {
      toast.error("Error al eliminar la foto");
    }
  }

  return (
    <>
      <AdminTopBar title="Galería de trabajos" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 max-w-lg space-y-4">
          <h2 className="font-semibold text-[#1C1C1E]">Agregar foto</h2>
          <SingleImageUpload
            value={form.url}
            onChange={(url, publicId) => setForm((p) => ({ ...p, url, publicId }))}
            onClear={() => setForm((p) => ({ ...p, url: "", publicId: "" }))}
            folder="muebles-fercho/galeria"
            label="Foto"
          />
          <div className="space-y-2">
            <Label>Título (opcional)</Label>
            <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Dormitorio en nogal" />
          </div>
          <Button onClick={add} disabled={saving || !form.url} className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Agregar foto
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#7A7A7A]" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`rounded-xl overflow-hidden border ${
                  photo.isActive ? "border-gray-100" : "border-gray-200 opacity-60"
                }`}
              >
                <div className="aspect-[4/3] bg-gray-100 relative">
                  <Image src={photo.url} alt={photo.title ?? "Foto"} fill className="object-cover" />
                </div>
                <div className="p-2 flex items-center justify-between gap-1">
                  <p className="text-xs text-[#2C2C2C] truncate flex-1">
                    {photo.title || <span className="text-gray-400 italic">Sin título</span>}
                  </p>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => toggle(photo)}
                      className="text-xs px-1.5 py-0.5 rounded border border-gray-200 text-[#7A7A7A] hover:text-[#1C1C1E] transition-colors whitespace-nowrap"
                    >
                      {photo.isActive ? "Ocultar" : "Mostrar"}
                    </button>
                    <button
                      onClick={() => remove(photo.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
