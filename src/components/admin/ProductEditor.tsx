"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Save, History } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface Category { id: number; name: string; }
interface Material { id: number; name: string; }
interface Measurement { id: number; label: string; }
interface PriceHistory { id: number; oldPrice: number; newPrice: number; changedAt: string; }
interface Variant {
  id: number; price: number; sku: string | null; stock: number | null; isActive: boolean;
  material: Material | null; measurement: Measurement | null;
  priceHistory: PriceHistory[];
}
interface Product {
  id: number; name: string; slug: string; description: string | null;
  categoryId: number; isFeatured: boolean; isActive: boolean;
  warrantyMonths: number | null; productionDays: number | null;
  retailPrice: number | null; wholesalePrice: number | null;
  category: Category;
  variants: Variant[];
}

export default function ProductEditor({
  productId,
  onSaved,
}: {
  productId: number;
  onSaved?: () => void;
}) {
  const id = String(productId);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", categoryId: "", description: "",
    warrantyMonths: "", productionDays: "",
    retailPrice: "", wholesalePrice: "",
    isFeatured: false, isActive: true,
  });
  const [newVariant, setNewVariant] = useState<{
    materialId: string; measurementId: string; price: string; sku: string; stock: string;
  }>({ materialId: "", measurementId: "", price: "", sku: "", stock: "" });
  const [addingVariant, setAddingVariant] = useState(false);
  const [historyVariant, setHistoryVariant] = useState<number | null>(null);

  async function load() {
    try {
      const [prodRes, catsRes, matsRes, medsRes] = await Promise.all([
        fetch(`/api/productos/${id}`),
        fetch("/api/categorias"),
        fetch("/api/materiales"),
        fetch("/api/medidas"),
      ]);
      if (!prodRes.ok) { toast.error("Producto no encontrado"); return; }
      const [prod, cats, mats, meds] = await Promise.all([
        prodRes.json(), catsRes.json(), matsRes.json(), medsRes.json(),
      ]);
      setProduct(prod);
      setCategories(cats);
      setMaterials(mats);
      setMeasurements(meds);
      setForm({
        name: prod.name, categoryId: String(prod.categoryId),
        description: prod.description ?? "",
        warrantyMonths: prod.warrantyMonths ? String(prod.warrantyMonths) : "",
        productionDays: prod.productionDays ? String(prod.productionDays) : "",
        retailPrice: prod.retailPrice ? String(prod.retailPrice) : "",
        wholesalePrice: prod.wholesalePrice ? String(prod.wholesalePrice) : "",
        isFeatured: prod.isFeatured, isActive: prod.isActive,
      });
    } catch {
      toast.error("Error al cargar el producto");
    }
  }

  useEffect(() => { load(); }, [id]);

  function setF(field: string, value: string | boolean | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/productos/${id}`, {
      method: "PUT",
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
    setSaving(false);
    if (res.ok) { toast.success("Producto guardado"); onSaved?.(); }
    else toast.error("Error al guardar");
  }

  async function addVariant() {
    if (!newVariant.price) { toast.error("El precio es requerido"); return; }
    setAddingVariant(true);
    const res = await fetch("/api/variantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: parseInt(id),
        materialId: newVariant.materialId ? parseInt(newVariant.materialId) : null,
        measurementId: newVariant.measurementId ? parseInt(newVariant.measurementId) : null,
        price: parseFloat(newVariant.price),
        sku: newVariant.sku || null,
        stock: newVariant.stock ? parseInt(newVariant.stock) : null,
      }),
    });
    setAddingVariant(false);
    if (res.ok) {
      toast.success("Variante agregada");
      setNewVariant({ materialId: "", measurementId: "", price: "", sku: "", stock: "" });
      load();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Error al agregar variante");
    }
  }

  async function updateVariantPrice(variantId: number, newPrice: string) {
    const res = await fetch(`/api/variantes/${variantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: parseFloat(newPrice) }),
    });
    if (res.ok) {
      toast.success("Precio actualizado");
      load();
    } else {
      toast.error("Error al actualizar el precio");
    }
  }

  async function deleteVariant(variantId: number) {
    if (!confirm("¿Eliminar esta variante?")) return;
    const res = await fetch(`/api/variantes/${variantId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Variante eliminada");
      load();
    } else {
      toast.error("Error al eliminar la variante");
    }
  }

  if (!product) return (
    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#7A7A7A]" /></div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <form onSubmit={saveProduct} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-4">
          <h2 className="font-semibold text-[#1C1C1E]">Datos del producto</h2>

          <div className="space-y-2">
            <Label>Nombre *</Label>
            <Input value={form.name} onChange={(e) => setF("name", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Categoría *</Label>
            <Select value={form.categoryId} onValueChange={(v) => setF("categoryId", v)}>
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
              onChange={(e) => setF("description", e.target.value)}
              rows={4}
              placeholder="Descripción del producto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Precio Minorista (S/.)</Label>
              <Input type="number" min="0" step="0.01" value={form.retailPrice} onChange={(e) => setF("retailPrice", e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Precio Mayorista (S/.)</Label>
              <Input type="number" min="0" step="0.01" value={form.wholesalePrice} onChange={(e) => setF("wholesalePrice", e.target.value)} placeholder="0.00" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Activo</Label>
            <Switch checked={form.isActive} onCheckedChange={(v) => setF("isActive", v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>En Promoción</Label>
            <Switch checked={form.isFeatured} onCheckedChange={(v) => setF("isFeatured", v)} />
          </div>

          <Button type="submit" disabled={saving} className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : <><Save className="w-4 h-4 mr-2" />Guardar</>}
          </Button>
        </form>

        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-4">
          <h2 className="font-semibold text-[#1C1C1E]">Variantes / Precios</h2>

          {product.variants.length > 0 && (
            <div className="space-y-2">
              {product.variants.map((v) => (
                <div key={v.id} className="border border-gray-100 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium text-[#1C1C1E]">
                        {[v.material?.name, v.measurement?.label].filter(Boolean).join(" / ") || "Sin especificar"}
                      </span>
                      {v.sku && <span className="ml-2 text-xs text-[#7A7A7A]">SKU: {v.sku}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setHistoryVariant(historyVariant === v.id ? null : v.id)}
                        className="text-[#7A7A7A] hover:text-[#C9A96E] transition-colors"
                        title="Ver historial de precios"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => deleteVariant(v.id)} className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#7A7A7A]">Precio:</span>
                    <Input
                      type="number" min="0" step="0.01"
                      defaultValue={Number(v.price)}
                      className="h-7 w-32 text-sm"
                      onBlur={(e) => {
                        if (parseFloat(e.target.value) !== Number(v.price)) {
                          updateVariantPrice(v.id, e.target.value);
                        }
                      }}
                    />
                    <span className="text-xs text-[#7A7A7A]">S/.</span>
                    {v.stock !== null && (
                      <span className="text-xs text-[#7A7A7A] ml-2">Stock: {v.stock}</span>
                    )}
                  </div>
                  {historyVariant === v.id && v.priceHistory.length > 0 && (
                    <div className="text-xs text-[#7A7A7A] bg-[#FAF9F7] rounded p-2 space-y-1">
                      <p className="font-medium text-[#2C2C2C]">Historial de precios:</p>
                      {v.priceHistory.map((h) => (
                        <p key={h.id}>
                          {formatPrice(h.oldPrice)} → {formatPrice(h.newPrice)}{" "}
                          <span className="text-[#7A7A7A]">
                            ({new Date(h.changedAt).toLocaleDateString("es-AR")})
                          </span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-sm font-medium text-[#1C1C1E]">Agregar variante</p>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={newVariant.materialId || "none"}
                onValueChange={(v) => { const val: string = (v ?? "") === "none" ? "" : (v ?? ""); setNewVariant((p) => ({ ...p, materialId: val })); }}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Material (opcional)">
                    {newVariant.materialId && newVariant.materialId !== "none" ? materials.find(m => String(m.id) === newVariant.materialId)?.name : "Material (opcional)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin material</SelectItem>
                  {materials.map((m) => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select
                value={newVariant.measurementId || "none"}
                onValueChange={(v) => { const val: string = (v ?? "") === "none" ? "" : (v ?? ""); setNewVariant((p) => ({ ...p, measurementId: val })); }}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Medida (opcional)">
                    {newVariant.measurementId && newVariant.measurementId !== "none" ? measurements.find(m => String(m.id) === newVariant.measurementId)?.label : "Medida (opcional)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin medida</SelectItem>
                  {measurements.map((m) => <SelectItem key={m.id} value={String(m.id)}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number" min="0" step="0.01" placeholder="Precio *"
                value={newVariant.price}
                onChange={(e) => setNewVariant((p) => ({ ...p, price: e.target.value }))}
                className="h-9 text-sm"
              />
              <Input
                placeholder="SKU"
                value={newVariant.sku}
                onChange={(e) => setNewVariant((p) => ({ ...p, sku: e.target.value }))}
                className="h-9 text-sm"
              />
              <Input
                type="number" min="0" placeholder="Stock"
                value={newVariant.stock}
                onChange={(e) => setNewVariant((p) => ({ ...p, stock: e.target.value }))}
                className="h-9 text-sm"
              />
            </div>
            <Button type="button" onClick={addVariant} disabled={addingVariant} className="w-full bg-[#C9A96E] hover:bg-[#b8965e] text-[#1C1C1E] font-medium">
              {addingVariant ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Agregar variante
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <h2 className="font-semibold text-[#1C1C1E] mb-4">Imágenes del producto</h2>
        <ImageUpload productId={parseInt(id)} />
      </div>
    </div>
  );
}
