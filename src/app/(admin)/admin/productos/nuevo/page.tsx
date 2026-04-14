"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Category { id: number; name: string; }

export default function NuevoProductoPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    description: "",
    warrantyMonths: "",
    productionDays: "",
    retailPrice: "",
    wholesalePrice: "",
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    fetch("/api/categorias").then((r) => r.json()).then(setCategories);
  }, []);

  function set(field: string, value: string | boolean | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId) {
      toast.error("Nombre y categoría son requeridos");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        categoryId: parseInt(form.categoryId),
        warrantyMonths: form.warrantyMonths ? parseInt(form.warrantyMonths) : null,
        productionDays: form.productionDays ? parseInt(form.productionDays) : null,
        retailPrice: form.retailPrice ? parseFloat(form.retailPrice) : null,
        wholesalePrice: form.wholesalePrice ? parseFloat(form.wholesalePrice) : null,
      }),
    });
    setLoading(false);
    if (res.ok) {
      const product = await res.json();
      toast.success("Producto creado. Ahora agregá imágenes y variantes.");
      router.push(`/admin/productos/${product.id}`);
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Error al crear");
    }
  }

  return (
    <>
      <AdminTopBar title="Nuevo producto" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Link href="/admin/productos" className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#1C1C1E] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <div className="max-w-xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-5">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ej: Cama matrimonial"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría">
                    {form.categoryId ? categories.find(c => String(c.id) === form.categoryId)?.name : "Seleccionar categoría"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Descripción del producto (opcional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Precio Minorista (S/.)</Label>
                <Input
                  type="number" min="0" step="0.01"
                  value={form.retailPrice}
                  onChange={(e) => set("retailPrice", e.target.value)}
                  placeholder="Ej: 1500"
                />
              </div>
              <div className="space-y-2">
                <Label>Precio Mayorista (S/.)</Label>
                <Input
                  type="number" min="0" step="0.01"
                  value={form.wholesalePrice}
                  onChange={(e) => set("wholesalePrice", e.target.value)}
                  placeholder="Ej: 120000"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <Label>Activo (visible en el catálogo)</Label>
              <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label>Destacado (aparece en homepage)</Label>
              <Switch checked={form.isFeatured} onCheckedChange={(v) => set("isFeatured", v)} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : "Crear y continuar"}
              </Button>
              <Link href="/admin/productos">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
