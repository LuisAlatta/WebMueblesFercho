"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import SingleImageUpload from "@/components/admin/SingleImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Category { id: number; name: string; }

export default function NuevoSetPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    imageUrl: "",
    imagePublicId: "",
  });

  useEffect(() => {
    fetch("/api/categorias").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    setLoading(true);
    const res = await fetch("/api/sets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        description: form.description.trim() || null,
        categoryId: form.categoryId || null,
        imageUrl: form.imageUrl || null,
        imagePublicId: form.imagePublicId || null,
      }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Set creado");
      router.push("/admin/sets");
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Error al crear");
    }
  }

  return (
    <>
      <AdminTopBar title="Nuevo set" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Link href="/admin/sets" className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#1C1C1E] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <div className="max-w-lg">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej: Dormitorio completo" autoFocus />
            </div>

            <div className="space-y-2">
              <Label>Categoría (opcional)</Label>
              <Select value={form.categoryId || "none"} onValueChange={(v) => set("categoryId", !v || v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Sin categoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin categoría</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Descripción (opcional)</Label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Descripción del set" rows={3} />
            </div>

            <SingleImageUpload
              value={form.imageUrl}
              onChange={(url, publicId) => setForm((p) => ({ ...p, imageUrl: url, imagePublicId: publicId }))}
              onClear={() => setForm((p) => ({ ...p, imageUrl: "", imagePublicId: "" }))}
              folder="muebles-fercho/sets"
              label="Imagen del set"
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : "Crear set"}
              </Button>
              <Link href="/admin/sets">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
