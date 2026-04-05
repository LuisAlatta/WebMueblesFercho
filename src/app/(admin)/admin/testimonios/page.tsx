"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";

interface Testimonial {
  id: number; clientName: string; text: string; rating: number;
  photoUrl: string | null; isActive: boolean;
}

export default function TestimoniosPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ clientName: "", text: "", rating: "5" });
  const [saving, setSaving] = useState(false);
  const { confirm, dialogProps } = useConfirmDialog();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/testimonios");
    if (res.ok) {
      const data = await res.json();
      setItems(data);
    } else {
      toast.error("Error al cargar testimonios");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!form.clientName || !form.text) { toast.error("Nombre y texto requeridos"); return; }
    const rating = parseInt(form.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) { toast.error("El rating debe ser entre 1 y 5"); return; }
    setSaving(true);
    const res = await fetch("/api/testimonios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, rating }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Testimonio agregado");
      setForm({ clientName: "", text: "", rating: "5" });
      load();
    } else {
      toast.error("Error al agregar testimonio");
    }
  }

  async function toggle(item: Testimonial) {
    const res = await fetch("/api/testimonios", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
    });
    if (res.ok) {
      load();
    } else {
      toast.error("Error al actualizar");
    }
  }

  function remove(id: number) {
    confirm({
      title: "Eliminar testimonio",
      description: "Esta accion no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch("/api/testimonios", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          toast.success("Eliminado");
          load();
        } else {
          toast.error("Error al eliminar");
        }
      },
    });
  }

  return (
    <>
      <AdminTopBar title="Testimonios" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold text-[#1C1C1E]">Agregar testimonio</h2>
            <div className="space-y-2">
              <Label>Nombre del cliente</Label>
              <Input
                value={form.clientName}
                onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
                placeholder="Maria Garcia"
              />
            </div>
            <div className="space-y-2">
              <Label>Comentario</Label>
              <Textarea
                value={form.text}
                onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                rows={3}
                placeholder="Excelente calidad..."
              />
            </div>
            <div className="space-y-2">
              <Label>Rating (1-5 estrellas)</Label>
              <div className="flex gap-1 items-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: String(n) }))}
                    className="p-1 rounded-md transition-colors hover:bg-[#FAF9F7]"
                  >
                    <Star
                      className={`w-7 h-7 transition-all duration-150 ${
                        n <= parseInt(form.rating)
                          ? "text-[#C9A96E] fill-[#C9A96E] drop-shadow-sm"
                          : "text-gray-200 hover:text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm text-[#7A7A7A] ml-2 font-medium">{form.rating}/5</span>
              </div>
            </div>
            <Button
              onClick={add}
              disabled={saving}
              className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Agregar
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-[#1C1C1E] mb-4">Testimonios ({items.length})</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-[#7A7A7A]" />
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                icon={Star}
                title="No hay testimonios"
                description="Agrega tu primer testimonio de cliente."
              />
            ) : (
              <ul className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                      className={`p-4 rounded-xl border transition-shadow duration-200 hover:shadow-md ${
                        item.isActive
                          ? "border-gray-100 bg-[#FAF9F7]"
                          : "border-gray-200 bg-gray-50 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1C1C1E]">{item.clientName}</p>
                          <div className="flex gap-0.5 my-1.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 transition-colors ${
                                  i < item.rating
                                    ? "text-[#C9A96E] fill-[#C9A96E]"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                            <span className="text-[10px] text-[#7A7A7A] ml-1.5 self-center">
                              {item.rating}/5
                            </span>
                          </div>
                          <p className="text-xs text-[#7A7A7A] line-clamp-2 leading-relaxed">{item.text}</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => toggle(item)}
                            className="text-xs text-[#7A7A7A] hover:text-[#1C1C1E] px-2.5 py-1 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-all duration-150 hover:shadow-sm"
                          >
                            {item.isActive ? "Ocultar" : "Mostrar"}
                          </button>
                          <button
                            onClick={() => remove(item.id)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150 p-1.5 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>
      </main>

      <ConfirmDialog {...dialogProps} />
    </>
  );
}
