"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

  async function load() {
    setLoading(true);
    const res = await fetch("/api/medidas");
    if (res.ok) {
      const data = await res.json();
      setMeasurements(data);
    } else {
      toast.error("Error al cargar medidas");
    }
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
      setNewLabel("");
      setNewDesc("");
      toast.success("Medida agregada");
      load();
    } else {
      toast.error("Ya existe esa medida");
    }
  }

  async function remove(id: number) {
    if (!confirm("¿Eliminar esta medida?")) return;
    const res = await fetch("/api/medidas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success("Medida eliminada");
      load();
    } else {
      toast.error("No se puede eliminar: está en uso por alguna variante");
    }
  }

  return (
    <>
      <AdminTopBar title="Medidas" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Formulario agregar */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold text-[#1C1C1E]">Agregar medida</h2>
            <div className="space-y-2">
              <Label>Etiqueta *</Label>
              <Input
                placeholder="Ej: 120x60x75 cm"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && add()}
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción (opcional)</Label>
              <Input
                placeholder="Ej: Largo x Ancho x Alto"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
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
              Agregar medida
            </Button>
          </div>

          {/* Lista */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-[#1C1C1E] mb-4">
              Medidas ({measurements.length})
            </h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-[#7A7A7A]" />
              </div>
            ) : (
              <ul className="space-y-2">
                {measurements.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between py-2 px-3 bg-[#FAF9F7] rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#2C2C2C]">{m.label}</p>
                      {m.description && (
                        <p className="text-xs text-[#7A7A7A]">{m.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => remove(m.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
                {measurements.length === 0 && (
                  <p className="text-sm text-[#7A7A7A] text-center py-4">
                    Sin medidas. Agrega la primera.
                  </p>
                )}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
