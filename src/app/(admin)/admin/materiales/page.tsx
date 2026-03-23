"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Material { id: number; name: string; }
interface Measurement { id: number; label: string; description: string | null; }

export default function MaterialesMedidasPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMaterial, setNewMaterial] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [savingM, setSavingM] = useState(false);
  const [savingMe, setSavingMe] = useState(false);

  async function load() {
    setLoading(true);
    const [m, me] = await Promise.all([
      fetch("/api/materiales").then((r) => r.json()),
      fetch("/api/medidas").then((r) => r.json()),
    ]);
    setMaterials(m);
    setMeasurements(me);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addMaterial() {
    if (!newMaterial.trim()) return;
    setSavingM(true);
    const res = await fetch("/api/materiales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newMaterial.trim() }),
    });
    setSavingM(false);
    if (res.ok) { setNewMaterial(""); toast.success("Material agregado"); load(); }
    else toast.error("Ya existe ese material");
  }

  async function deleteMaterial(id: number) {
    if (!confirm("¿Eliminar este material?")) return;
    await fetch("/api/materiales", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast.success("Material eliminado"); load();
  }

  async function addMeasurement() {
    if (!newLabel.trim()) return;
    setSavingMe(true);
    const res = await fetch("/api/medidas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel.trim(), description: newDesc.trim() || null }),
    });
    setSavingMe(false);
    if (res.ok) { setNewLabel(""); setNewDesc(""); toast.success("Medida agregada"); load(); }
    else toast.error("Ya existe esa medida");
  }

  async function deleteMeasurement(id: number) {
    if (!confirm("¿Eliminar esta medida?")) return;
    await fetch("/api/medidas", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast.success("Medida eliminada"); load();
  }

  if (loading) return (
    <>
      <AdminTopBar title="Materiales y Medidas" />
      <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#7A7A7A]" /></div>
    </>
  );

  return (
    <>
      <AdminTopBar title="Materiales y Medidas" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Materiales */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-[#1C1C1E] mb-4">Materiales</h2>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Ej: Madera Maciza"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMaterial()}
              />
              <Button onClick={addMaterial} disabled={savingM} className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white shrink-0">
                {savingM ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>
            <ul className="space-y-2">
              {materials.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2 px-3 bg-[#FAF9F7] rounded-lg">
                  <span className="text-sm text-[#2C2C2C]">{m.name}</span>
                  <button onClick={() => deleteMaterial(m.id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
              {materials.length === 0 && <p className="text-sm text-[#7A7A7A] text-center py-4">Sin materiales</p>}
            </ul>
          </div>

          {/* Medidas */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-[#1C1C1E] mb-4">Medidas</h2>
            <div className="space-y-2 mb-4">
              <Input
                placeholder="Ej: 120x60x75 cm"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
              <Input
                placeholder="Descripción (opcional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <Button onClick={addMeasurement} disabled={savingMe} className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
                {savingMe ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Agregar medida
              </Button>
            </div>
            <ul className="space-y-2">
              {measurements.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2 px-3 bg-[#FAF9F7] rounded-lg">
                  <div>
                    <p className="text-sm text-[#2C2C2C] font-medium">{m.label}</p>
                    {m.description && <p className="text-xs text-[#7A7A7A]">{m.description}</p>}
                  </div>
                  <button onClick={() => deleteMeasurement(m.id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
              {measurements.length === 0 && <p className="text-sm text-[#7A7A7A] text-center py-4">Sin medidas</p>}
            </ul>
          </div>

        </div>
      </main>
    </>
  );
}
