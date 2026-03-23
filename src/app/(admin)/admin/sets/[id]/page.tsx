"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import SingleImageUpload from "@/components/admin/SingleImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Category { id: number; name: string; }
interface Product { id: number; name: string; slug: string; }
interface SetItem { id: number; product: Product; }

export default function EditSetPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<SetItem[]>([]);
  const [addingProductId, setAddingProductId] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    imageUrl: "",
    imagePublicId: "",
    isActive: true,
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/sets/${id}`).then((r) => r.json()),
      fetch("/api/categorias").then((r) => r.json()),
      fetch("/api/productos?limit=200").then((r) => r.json()),
    ])
      .then(([setData, cats, prods]) => {
        setForm({
          name: setData.name ?? "",
          description: setData.description ?? "",
          categoryId: setData.category?.id ? String(setData.category.id) : "",
          imageUrl: setData.imageUrl ?? "",
          imagePublicId: setData.imagePublicId ?? "",
          isActive: setData.isActive ?? true,
        });
        setItems(setData.items ?? []);
        setCategories(cats);
        setAllProducts(prods.products ?? []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error al cargar el set");
        router.push("/admin/sets");
      });
  }, [id]);

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    setSaving(true);
    const res = await fetch(`/api/sets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        description: form.description.trim() || null,
        categoryId: form.categoryId || null,
        imageUrl: form.imageUrl || null,
        imagePublicId: form.imagePublicId || null,
        isActive: form.isActive,
      }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Set actualizado");
      router.push("/admin/sets");
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Error al guardar");
    }
  }

  async function addProduct() {
    if (!addingProductId) { toast.error("Selecciona un producto"); return; }
    const res = await fetch(`/api/sets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addProductId: parseInt(addingProductId) }),
    });
    if (res.ok) {
      toast.success("Producto agregado al set");
      setAddingProductId("");
      // Reload items
      const updated = await fetch(`/api/sets/${id}`).then((r) => r.json());
      setItems(updated.items ?? []);
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Error al agregar");
    }
  }

  async function removeItem(itemId: number) {
    if (!confirm("¿Quitar este producto del set?")) return;
    const res = await fetch(`/api/sets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ removeItemId: itemId }),
    });
    if (res.ok) {
      toast.success("Producto quitado");
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      toast.error("Error al quitar");
    }
  }

  const usedProductIds = new Set(items.map((i) => i.product.id));
  const availableProducts = allProducts.filter((p) => !usedProductIds.has(p.id));

  if (loading) {
    return (
      <>
        <AdminTopBar title="Editar set" />
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#7A7A7A]" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar title={`Editar: ${form.name}`} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <Link href="/admin/sets" className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#1C1C1E] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Datos del set */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-4">
            <h2 className="font-semibold text-[#1C1C1E]">Datos del set</h2>

            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
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
              <Label>Descripción</Label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
            </div>

            <SingleImageUpload
              value={form.imageUrl}
              onChange={(url, publicId) => setForm((p) => ({ ...p, imageUrl: url, imagePublicId: publicId }))}
              onClear={() => setForm((p) => ({ ...p, imageUrl: "", imagePublicId: "" }))}
              folder="muebles-fercho/sets"
              label="Imagen del set"
            />

            <div className="flex items-center justify-between py-1">
              <Label>Activo (visible en el catálogo)</Label>
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => set("isActive", v)}
              />
            </div>

            <div className="flex gap-3 pt-2 flex-wrap">
              <Button type="submit" disabled={saving} className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : "Guardar cambios"}
              </Button>
              <Link href="/admin/sets">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>

          {/* Productos del set */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-4">
            <h2 className="font-semibold text-[#1C1C1E]">Productos del set ({items.length})</h2>

            {/* Agregar producto */}
            <div className="flex gap-2">
              <Select value={addingProductId} onValueChange={(v) => setAddingProductId(v ?? "")}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar producto..." />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={addProduct}
                disabled={!addingProductId}
                className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Lista de productos */}
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2 px-3 bg-[#FAF9F7] rounded-lg">
                  <span className="text-sm text-[#2C2C2C]">{item.product.name}</span>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-[#7A7A7A] text-center py-4">Sin productos. Agrega el primero.</p>
              )}
            </ul>
          </div>

        </div>
      </main>
    </>
  );
}
