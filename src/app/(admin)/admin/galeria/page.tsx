"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import LoadingButton from "@/components/admin/LoadingButton";
import SingleImageUpload from "@/components/admin/SingleImageUpload";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Images, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryPhoto {
  id: number;
  url: string;
  publicId: string;
  title: string | null;
  description: string | null;
  isActive: boolean;
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-slate-200/70">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="p-2 flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GaleriaPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ url: "", publicId: "", title: "" });
  const [saving, setSaving] = useState(false);
  const { confirm, dialogProps } = useConfirmDialog();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/galeria");
    if (res.ok) setPhotos(await res.json());
    else toast.error("Error al cargar la galería");
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!form.url || !form.publicId) { toast.error("Debés subir una imagen primero"); return; }
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
    if (res.ok) load();
    else toast.error("Error al actualizar");
  }

  function remove(photo: GalleryPhoto) {
    confirm({
      title: "Eliminar foto",
      itemName: photo.title || "Sin título",
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch("/api/galeria", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: photo.id }),
        });
        if (res.ok) { toast.success("Foto eliminada"); load(); }
        else toast.error("Error al eliminar la foto");
      },
    });
  }

  return (
    <>
      <AdminTopBar title="Galería de trabajos" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <PageHeader
          title="Galería de trabajos"
          description="Fotos de muebles terminados que se muestran en la tienda."
          icon={Images}
        />

        {/* Upload form */}
        <div className="admin-card p-5 max-w-lg space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Agregar foto</h3>
          <SingleImageUpload
            value={form.url}
            onChange={(url, publicId) => setForm((p) => ({ ...p, url, publicId }))}
            onClear={() => setForm((p) => ({ ...p, url: "", publicId: "" }))}
            folder="muebles-fercho/galeria"
            label="Foto"
          />
          <FormField label="Título" htmlFor="gal-title" optional>
            <Input
              id="gal-title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Dormitorio en nogal"
              className="h-9"
            />
          </FormField>
          <LoadingButton
            onClick={add}
            loading={saving}
            loadingText="Agregando..."
            disabled={!form.url}
            className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white h-9"
          >
            <Plus className="w-4 h-4" /> Agregar foto
          </LoadingButton>
        </div>

        {/* Gallery grid */}
        {loading ? (
          <GallerySkeleton />
        ) : photos.length === 0 ? (
          <EmptyState
            icon={Images}
            title="No hay fotos en la galería"
            description="Subí tu primera foto para empezar."
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={`group rounded-xl overflow-hidden border bg-white transition-all duration-200 hover:shadow-md ${
                    photo.isActive ? "border-slate-200/70" : "border-slate-200 opacity-50"
                  }`}
                >
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                    <Image
                      src={photo.url}
                      alt={photo.title ?? "Foto"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2 flex items-center justify-between gap-1">
                    <p className="text-xs text-slate-700 truncate flex-1">
                      {photo.title || <span className="text-slate-400 italic">Sin título</span>}
                    </p>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => toggle(photo)}
                        className="text-xs px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors whitespace-nowrap"
                      >
                        {photo.isActive ? "Ocultar" : "Mostrar"}
                      </button>
                      <button
                        onClick={() => remove(photo)}
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors p-0.5 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <ConfirmDialog {...dialogProps} />
    </>
  );
}
