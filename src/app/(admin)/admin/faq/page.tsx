"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Loader2, Pencil, Check, X, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";

interface Faq { id: number; question: string; answer: string; order: number; isActive: boolean; }

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [editing, setEditing] = useState<Faq | null>(null);
  const [saving, setSaving] = useState(false);
  const { confirm, dialogProps } = useConfirmDialog();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/faq");
    if (res.ok) {
      const data = await res.json();
      setFaqs(data);
    } else {
      toast.error("Error al cargar preguntas");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Pregunta y respuesta requeridas");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: faqs.length }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("FAQ agregada");
      setForm({ question: "", answer: "" });
      load();
    } else {
      toast.error("Error al agregar la pregunta");
    }
  }

  async function save() {
    if (!editing) return;
    if (!editing.question.trim() || !editing.answer.trim()) {
      toast.error("Pregunta y respuesta requeridas");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/faq", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (res.ok) {
      setEditing(null);
      toast.success("FAQ actualizada");
      load();
    } else {
      toast.error("Error al actualizar la pregunta");
    }
  }

  function remove(id: number) {
    confirm({
      title: "Eliminar pregunta",
      description: "Esta accion no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch("/api/faq", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          toast.success("FAQ eliminada");
          load();
        } else {
          toast.error("Error al eliminar la pregunta");
        }
      },
    });
  }

  return (
    <>
      <AdminTopBar title="Preguntas frecuentes" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Formulario */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold text-[#1C1C1E]">Agregar pregunta</h2>
            <div className="space-y-2">
              <Label>Pregunta</Label>
              <Input
                value={form.question}
                onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                placeholder="¿Cuanto tiempo tarda la fabricacion?"
              />
            </div>
            <div className="space-y-2">
              <Label>Respuesta</Label>
              <Textarea
                value={form.answer}
                onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
                rows={3}
                placeholder="Nuestros tiempos de fabricacion..."
              />
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

          {/* Lista */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-[#1C1C1E] mb-4">FAQs ({faqs.length})</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-[#7A7A7A]" />
              </div>
            ) : faqs.length === 0 ? (
              <EmptyState
                icon={HelpCircle}
                title="No hay preguntas"
                description="Agrega tu primera pregunta frecuente."
              />
            ) : (
              <ul className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {faqs.map((faq, index) => (
                    <motion.li
                      key={faq.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                      className="p-4 rounded-xl border border-gray-100 bg-[#FAF9F7] transition-shadow duration-200 hover:shadow-md"
                    >
                      {editing?.id === faq.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editing.question}
                            onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                          />
                          <Textarea
                            value={editing.answer}
                            onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={save}
                              disabled={saving}
                              className="h-7 bg-[#1C1C1E] text-white hover:bg-[#2C2C2E]"
                            >
                              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditing(null)}
                              className="h-7"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1C1C1E]">{faq.question}</p>
                            <p className="text-xs text-[#7A7A7A] mt-1.5 line-clamp-2 leading-relaxed">{faq.answer}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => setEditing(faq)}
                              className="text-[#7A7A7A] hover:text-[#1C1C1E] hover:bg-gray-100 transition-all duration-150 p-1.5 rounded-lg"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => remove(faq.id)}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150 p-1.5 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
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
