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

  async function remove(id: number) {
    if (!confirm("¿Eliminar este testimonio?")) return;
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
                placeholder="María García"
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
              <Label>Rating (1–5 estrellas)</Label>
              <div className="flex gap-2 items-center">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: String(n) }))}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        n <= parseInt(form.rating)
                          ? "text-[#C9A96E] fill-[#C9A96E]"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm text-[#7A7A7A] ml-1">{form.rating}/5</span>
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
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className={`p-3 rounded-lg border ${
                      item.isActive
                        ? "border-gray-100 bg-[#FAF9F7]"
                        : "border-gray-100 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1C1C1E]">{item.clientName}</p>
                        <div className="flex gap-0.5 my-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < item.rating ? "text-[#C9A96E] fill-[#C9A96E]" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-[#7A7A7A] line-clamp-2">{item.text}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => toggle(item)}
                          className="text-xs text-[#7A7A7A] hover:text-[#1C1C1E] px-2 py-1 rounded bg-white border border-gray-200 transition-colors"
                        >
                          {item.isActive ? "Ocultar" : "Mostrar"}
                        </button>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                {items.length === 0 && (
                  <p className="text-sm text-[#7A7A7A] text-center py-4">Sin testimonios</p>
                )}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
