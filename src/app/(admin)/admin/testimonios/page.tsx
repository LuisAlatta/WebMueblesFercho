"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import LoadingButton from "@/components/admin/LoadingButton";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Star, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: number;
  clientName: string;
  text: string;
  rating: number;
  photoUrl: string | null;
  isActive: boolean;
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
    if (res.ok) setItems(await res.json());
    else toast.error("Error al cargar testimonios");
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
    if (res.ok) load();
    else toast.error("Error al actualizar");
  }

  function remove(item: Testimonial) {
    confirm({
      title: "Eliminar testimonio",
      itemName: item.clientName,
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch("/api/testimonios", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id }),
        });
        if (res.ok) { toast.success("Eliminado"); load(); }
        else toast.error("Error al eliminar");
      },
    });
  }

  return (
    <>
      <AdminTopBar title="Testimonios" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          title="Testimonios"
          description="Opiniones de clientes que se muestran en la tienda."
          icon={Star}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="admin-card p-5 space-y-4 self-start">
            <h3 className="text-sm font-semibold text-slate-900">Agregar testimonio</h3>
            <FormField label="Nombre del cliente" htmlFor="test-name" required>
              <Input
                id="test-name"
                value={form.clientName}
                onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))}
                placeholder="María García"
                className="h-9"
              />
            </FormField>
            <FormField label="Comentario" htmlFor="test-text" required>
              <Textarea
                id="test-text"
                value={form.text}
                onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                rows={3}
                placeholder="Excelente calidad..."
              />
            </FormField>
            <FormField label="Rating">
              <div className="flex gap-1 items-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: String(n) }))}
                    className="p-1 rounded-md transition-colors hover:bg-slate-100"
                  >
                    <Star
                      className={`w-6 h-6 transition-all duration-150 ${
                        n <= parseInt(form.rating)
                          ? "text-[#C9A96E] fill-[#C9A96E]"
                          : "text-slate-200 hover:text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm text-slate-500 ml-2 font-medium">{form.rating}/5</span>
              </div>
            </FormField>
            <LoadingButton
              onClick={add}
              loading={saving}
              loadingText="Agregando..."
              className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white h-9"
            >
              <Plus className="w-4 h-4" /> Agregar
            </LoadingButton>
          </div>

          <div className="admin-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Testimonios</h3>
              {items.length > 0 && (
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : items.length === 0 ? (
              <EmptyState icon={Star} title="No hay testimonios" description="Agregá tu primer testimonio de cliente." size="sm" />
            ) : (
              <ul className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                        item.isActive
                          ? "border-slate-200/70 bg-slate-50/50"
                          : "border-slate-200 bg-slate-50 opacity-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{item.clientName}</p>
                          <div className="flex gap-0.5 my-1.5">
                            {Array.from({ length: 5 }).map((_, si) => (
                              <Star
                                key={si}
                                className={`w-3.5 h-3.5 ${
                                  si < item.rating ? "text-[#C9A96E] fill-[#C9A96E]" : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.text}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => toggle(item)}
                            className="text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                          >
                            {item.isActive ? "Ocultar" : "Mostrar"}
                          </button>
                          <button
                            onClick={() => remove(item)}
                            className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors p-1.5 rounded-lg"
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
