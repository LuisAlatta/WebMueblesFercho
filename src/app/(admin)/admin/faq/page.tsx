"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import PageHeader from "@/components/admin/PageHeader";
import FormField from "@/components/admin/FormField";
import LoadingButton from "@/components/admin/LoadingButton";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Pencil, Check, X, HelpCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Faq {
  id: number;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

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
    if (res.ok) setFaqs(await res.json());
    else toast.error("Error al cargar preguntas");
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

  function remove(faq: Faq) {
    confirm({
      title: "Eliminar pregunta",
      itemName: faq.question,
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch("/api/faq", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: faq.id }),
        });
        if (res.ok) { toast.success("FAQ eliminada"); load(); }
        else toast.error("Error al eliminar la pregunta");
      },
    });
  }

  return (
    <>
      <AdminTopBar title="Preguntas frecuentes" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          title="Preguntas frecuentes"
          description="Las FAQ se muestran en la sección de contacto del sitio."
          icon={HelpCircle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="admin-card p-5 space-y-4 self-start">
            <h3 className="text-sm font-semibold text-slate-900">Agregar pregunta</h3>
            <FormField label="Pregunta" htmlFor="faq-q" required>
              <Input
                id="faq-q"
                value={form.question}
                onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                placeholder="¿Cuánto tiempo tarda la fabricación?"
                className="h-9"
              />
            </FormField>
            <FormField label="Respuesta" htmlFor="faq-a" required>
              <Textarea
                id="faq-a"
                value={form.answer}
                onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
                rows={3}
                placeholder="Nuestros tiempos de fabricación..."
              />
            </FormField>
            <LoadingButton
              onClick={add}
              loading={saving && !editing}
              loadingText="Agregando..."
              className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white h-9"
            >
              <Plus className="w-4 h-4" /> Agregar
            </LoadingButton>
          </div>

          <div className="admin-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">FAQs</h3>
              {faqs.length > 0 && (
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {faqs.length}
                </span>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : faqs.length === 0 ? (
              <EmptyState icon={HelpCircle} title="No hay preguntas" description="Agregá tu primera pregunta frecuente." size="sm" />
            ) : (
              <ul className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {faqs.map((faq, i) => (
                    <motion.li
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50 transition-all hover:shadow-sm"
                    >
                      {editing?.id === faq.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editing.question}
                            onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                            className="h-9"
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
                              className="h-8 bg-[#1C1C1E] text-white hover:bg-[#2C2C2E]"
                            >
                              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              <span className="ml-1">Guardar</span>
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditing(null)} className="h-8">
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                            <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">{faq.answer}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => setEditing(faq)}
                              className="text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors p-1.5 rounded-lg"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => remove(faq)}
                              className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors p-1.5 rounded-lg"
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
