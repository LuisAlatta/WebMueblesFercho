"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";

export default function ContactForm({ whatsapp }: { whatsapp?: string | null }) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    if (!whatsapp) return;
    const text = `Hola! Soy ${form.name}${form.phone ? ` (${form.phone})` : ""}.\n\n${form.message}`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-semibold text-[#1C1C1E] mb-5">Envianos tu consulta</h2>
      <form onSubmit={handleWhatsApp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tu nombre *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Juan García"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono (opcional)</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+54 11 1234-5678"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">¿Qué necesitás? *</Label>
          <Textarea
            id="message"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Ej: Necesito una cama de 2 plazas en madera para una habitación de 3x4m..."
            rows={5}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={!whatsapp}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Enviar por WhatsApp
        </Button>
        {!whatsapp && (
          <p className="text-xs text-[#7A7A7A] text-center">
            El número de WhatsApp no está configurado todavía.
          </p>
        )}
      </form>
    </div>
  );
}
