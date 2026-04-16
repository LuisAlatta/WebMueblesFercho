"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import LoadingButton from "@/components/admin/LoadingButton";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { Input } from "@/components/ui/input";
import { Trash2, Ruler, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Measurement {
  id: number;
  label: string;
  description: string | null;
}

export default function MedidasPage() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const { confirm, dialogProps } = useConfirmDialog();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/medidas");
    if (res.ok) setMeasurements(await res.json());
    else toast.error("Error al cargar medidas");
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!newLabel.trim()) { toast.error("La etiqueta es requerida"); return; }
    setSaving(true);
    const res = await fetch("/api/medidas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel.trim(), description: newDesc.trim() || null }),
    });
    setSaving(false);
    if (res.ok) {
      setNewLabel(""); setNewDesc("");
      toast.success("Medida agregada");
      load();
    } else {
      toast.error("Ya existe esa medida");
    }
  }

  function remove(m: Measurement) {
    confirm({
      title: "Eliminar medida",
      itemName: m.label,
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch("/api/medidas", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: m.id }),
        });
        if (res.ok) { toast.success("Medida eliminada"); load(); }
        else toast.error("No se puede eliminar: está en uso por alguna variante");
      },
    });
  }

  return (
    <>
      <AdminTopBar title="Medidas" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          title="Medidas"
          description="Dimensiones disponibles para las variantes de producto."
          icon={Ruler}
        />

        <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="admin-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Agregar medida</h3>
            <FormField label="Etiqueta" htmlFor="med-label" required>
              <Input
                id="med-label"
                placeholder="Ej: 120x60x75 cm"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
                className="h-9"
              />
            </FormField>
            <FormField label="Descripción" htmlFor="med-desc" optional>
              <Input
                id="med-desc"
                placeholder="Ej: Largo x Ancho x Alto"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="h-9"
              />
            </FormField>
            <LoadingButton
              onClick={add}
              loading={saving}
              loadingText="Agregando..."
              className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white h-9"
            >
              <Plus className="w-4 h-4" /> Agregar medida
            </LoadingButton>
          </div>

          <div className="admin-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Medidas</h3>
              {measurements.length > 0 && (
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {measurements.length}
                </span>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : measurements.length === 0 ? (
              <EmptyState
                icon={Ruler}
                title="No hay medidas"
                description="Agregá tu primera medida."
                size="sm"
              />
            ) : (
              <ul className="space-y-1.5">
                <AnimatePresence mode="popLayout">
                  {measurements.map((m, i) => (
                    <motion.li
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.18, delay: i * 0.03 }}
                      className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-slate-800 font-medium">{m.label}</p>
                        {m.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => remove(m)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                        aria-label={`Eliminar ${m.label}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
