"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import LoadingButton from "@/components/admin/LoadingButton";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { Input } from "@/components/ui/input";
import { Trash2, Layers, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Material {
  id: number;
  name: string;
}

export default function MaterialesPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMaterial, setNewMaterial] = useState("");
  const [saving, setSaving] = useState(false);
  const { confirm, dialogProps } = useConfirmDialog();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/materiales");
    if (res.ok) setMaterials(await res.json());
    else toast.error("Error al cargar materiales");
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!newMaterial.trim()) { toast.error("El nombre es requerido"); return; }
    setSaving(true);
    const res = await fetch("/api/materiales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newMaterial.trim() }),
    });
    setSaving(false);
    if (res.ok) {
      setNewMaterial("");
      toast.success("Material agregado");
      load();
    } else {
      toast.error("Ya existe ese material");
    }
  }

  function remove(m: Material) {
    confirm({
      title: "Eliminar material",
      itemName: m.name,
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch("/api/materiales", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: m.id }),
        });
        if (res.ok) { toast.success("Material eliminado"); load(); }
        else toast.error("No se puede eliminar: está en uso por alguna variante");
      },
    });
  }

  return (
    <>
      <AdminTopBar title="Materiales" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          title="Materiales"
          description="Tipos de material disponibles para las variantes de producto."
          icon={Layers}
        />

        <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="admin-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Agregar material</h3>
            <FormField label="Nombre" htmlFor="mat-name" required>
              <Input
                id="mat-name"
                placeholder="Ej: Madera Maciza"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
                className="h-9"
              />
            </FormField>
            <LoadingButton
              onClick={add}
              loading={saving}
              loadingText="Agregando..."
              className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white h-9"
            >
              <Plus className="w-4 h-4" /> Agregar material
            </LoadingButton>
          </div>

          {/* Lista */}
          <div className="admin-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Materiales</h3>
              {materials.length > 0 && (
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {materials.length}
                </span>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : materials.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No hay materiales"
                description="Agregá tu primer material."
                size="sm"
              />
            ) : (
              <ul className="space-y-1.5">
                <AnimatePresence mode="popLayout">
                  {materials.map((m, i) => (
                    <motion.li
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.18, delay: i * 0.03 }}
                      className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                    >
                      <span className="text-sm text-slate-800">{m.name}</span>
                      <button
                        onClick={() => remove(m)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                        aria-label={`Eliminar ${m.name}`}
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
