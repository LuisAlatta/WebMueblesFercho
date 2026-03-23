"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Faq { id: number; question: string; answer: string; order: number; isActive: boolean; }

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [editing, setEditing] = useState<Faq | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const data = await fetch("/api/faq").then((r) => r.json());
    setFaqs(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!form.question || !form.answer) { toast.error("Pregunta y respuesta requeridas"); return; }
    setSaving(true);
    await fetch("/api/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: faqs.length }),
    });
    setSaving(false);
    toast.success("FAQ agregada");
    setForm({ question: "", answer: "" });
    load();
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    await fetch("/api/faq", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    setEditing(null);
    toast.success("FAQ actualizada");
    load();
  }

  async function remove(id: number) {
    if (!confirm("¿Eliminar esta FAQ?")) return;
    await fetch("/api/faq", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast.success("FAQ eliminada"); load();
  }

  return (
    <>
      <AdminTopBar title="Preguntas frecuentes" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold text-[#1C1C1E]">Agregar pregunta</h2>
            <div className="space-y-2">
              <Label>Pregunta</Label>
              <Input value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} placeholder="¿Cuánto tiempo tarda la fabricación?" />
            </div>
            <div className="space-y-2">
              <Label>Respuesta</Label>
              <Textarea value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} rows={3} placeholder="Nuestros tiempos de fabricación..." />
            </div>
            <Button onClick={add} disabled={saving} className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Agregar
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-[#1C1C1E] mb-4">FAQs ({faqs.length})</h2>
            {loading ? <Loader2 className="w-5 h-5 animate-spin text-[#7A7A7A]" /> : (
              <ul className="space-y-3">
                {faqs.map((faq) => (
                  <li key={faq.id} className="p-3 rounded-lg border border-gray-100 bg-[#FAF9F7]">
                    {editing?.id === faq.id ? (
                      <div className="space-y-2">
                        <Input value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} />
                        <Textarea value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} rows={2} />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={save} disabled={saving} className="h-7 bg-[#1C1C1E] text-white hover:bg-[#2C2C2E]">
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditing(null)} className="h-7">
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1C1C1E]">{faq.question}</p>
                          <p className="text-xs text-[#7A7A7A] mt-1 line-clamp-2">{faq.answer}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setEditing(faq)} className="text-[#7A7A7A] hover:text-[#1C1C1E]"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => remove(faq.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
                {faqs.length === 0 && <p className="text-sm text-[#7A7A7A] text-center py-4">Sin preguntas frecuentes</p>}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
