"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2, Layers } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";

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
    if (res.ok) {
      const data = await res.json();
      setMaterials(data);
    } else {
      toast.error("Error al cargar materiales");
    }
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

  function remove(id: number) {
    confirm({
      title: "Eliminar material",
      description: "Este material se eliminara permanentemente. Esta accion no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch("/api/materiales", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          toast.success("Material eliminado");
          load();
        } else {
          toast.error("No se puede eliminar: esta en uso por alguna variante");
        }
      },
    });
  }

  return (
    <>
      <AdminTopBar title="Materiales" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Formulario agregar */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold text-[#1C1C1E]">Agregar material</h2>
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input
                placeholder="Ej: Madera Maciza"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
              />
            </div>
            <Button
              onClick={add}
              disabled={saving}
              className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white"
            >
              {saving
                ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                : <Plus className="w-4 h-4 mr-2" />}
              Agregar material
            </Button>
          </div>

          {/* Lista */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1C1C1E]">Materiales</h2>
              {materials.length > 0 && (
                <span className="text-xs font-medium bg-[#FAF9F7] text-[#7A7A7A] border border-gray-100 px-2 py-0.5 rounded-full">
                  {materials.length}
                </span>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-[#7A7A7A]" />
              </div>
            ) : materials.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No hay materiales"
                description="Agrega tu primer material."
              />
            ) : (
              <ul className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {materials.map((m, i) => (
                    <motion.li
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      className="flex items-center justify-between py-2 px-3 bg-[#FAF9F7] rounded-lg hover:shadow-sm hover:bg-[#F5F3F0] transition-all duration-150"
                    >
                      <span className="text-sm text-[#2C2C2C]">{m.name}</span>
                      <button
                        onClick={() => remove(m.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
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
