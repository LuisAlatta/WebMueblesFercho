"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: number; clientName: string; text: string; rating: number;
  photoUrl: string | null; isActive: boolean;
}

export default function TestimoniosPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ clientName: "", text: "", rating: "5" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const data = await fetch("/api/testimonios").then((r) => r.json());
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!form.clientName || !form.text) { toast.error("Nombre y texto requeridos"); return; }
    setSaving(true);
    await fetch("/api/testimonios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, rating: parseInt(form.rating) }),
    });
    setSaving(false);
    toast.success("Testimonio agregado");
    setForm({ clientName: "", text: "", rating: "5" });
    load();
  }

  async function toggle(item: Testimonial) {
    await fetch("/api/testimonios", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm("¿Eliminar este testimonio?")) return;
    await fetch("/api/testimonios", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast.success("Eliminado"); load();
  }

  return (
    <>
      <AdminTopBar title="Testimonios" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold text-[#1C1C1E]">Agregar testimonio</h2>
            <div className="space-y-2">
              <Label>Nombre del cliente</Label>
              <Input value={form.clientName} onChange={(e) => setForm((p) => ({ ...p, clientName: e.target.value }))} placeholder="María García" />
            </div>
            <div className="space-y-2">
              <Label>Comentario</Label>
              <Textarea value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} rows={3} placeholder="Excelente calidad..." />
            </div>
            <div className="space-y-2">
              <Label>Rating (1-5)</Label>
              <Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))} />
            </div>
            <Button onClick={add} disabled={saving} className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Agregar
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-[#1C1C1E] mb-4">Testimonios ({items.length})</h2>
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-[#7A7A7A]" /> : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className={`p-3 rounded-lg border ${item.isActive ? "border-gray-100 bg-[#FAF9F7]" : "border-gray-100 bg-gray-50 opacity-60"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1C1C1E]">{item.clientName}</p>
                        <div className="flex gap-0.5 my-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < item.rating ? "text-[#C9A96E] fill-[#C9A96E]" : "text-gray-300"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-[#7A7A7A] line-clamp-2">{item.text}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => toggle(item)} className="text-xs text-[#7A7A7A] hover:text-[#1C1C1E] px-2 py-1 rounded bg-white border border-gray-200">
                          {item.isActive ? "Ocultar" : "Mostrar"}
                        </button>
                        <button onClick={() => remove(item.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                {items.length === 0 && <p className="text-sm text-[#7A7A7A] text-center py-4">Sin testimonios</p>}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
