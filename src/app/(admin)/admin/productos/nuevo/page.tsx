"use client";

import { useEffect, useRef, useState } from "react";
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
import { ArrowLeft, Loader2, Upload, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface Category { id: number; name: string; }

interface PendingImage {
  file: File;
  preview: string;
}

export default function NuevoProductoPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    description: "",
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

  function handleFileSelect(files: FileList | null) {
    if (!files) return;
    const newImages: PendingImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPendingImages((prev) => [...prev, ...newImages]);
  }

  function removeImage(index: number) {
    setPendingImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId) {
      toast.error("Nombre y categoría son requeridos");
      return;
    }
    setLoading(true);

    // 1. Create the product
    const res = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        categoryId: parseInt(form.categoryId),
        warrantyMonths: null,
        productionDays: null,
        retailPrice: form.retailPrice ? parseFloat(form.retailPrice) : null,
        wholesalePrice: form.wholesalePrice ? parseFloat(form.wholesalePrice) : null,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error ?? "Error al crear");
      setLoading(false);
      return;
    }

    const product = await res.json();

    // 2. Upload images if any
    if (pendingImages.length > 0) {
      for (const img of pendingImages) {
        try {
          const formData = new FormData();
          formData.append("file", img.file);
          formData.append("folder", "productos");

          const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
          if (!uploadRes.ok) {
            toast.error(`Error subiendo ${img.file.name}`);
            continue;
          }
          const { url, path } = await uploadRes.json();

          await fetch(`/api/productos/${product.id}/imagenes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, publicId: path }),
          });
        } catch {
          toast.error(`Error subiendo ${img.file.name}`);
        }
      }
    }

    toast.success("Producto creado correctamente");
    setLoading(false);
    router.push("/admin/productos");
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
                  placeholder="Ej: 1200"
                />
              </div>
            </div>

            {/* Image upload section */}
            <div className="space-y-3">
              <Label>Imágenes del producto</Label>

              {/* Pending images preview */}
              {pendingImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {pendingImages.map((img, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <Image
                        src={img.preview}
                        alt={`Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 text-xs bg-[#C9A96E] text-[#1C1C1E] px-1 py-0.5 rounded font-medium">
                          Principal
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {/* Add more button */}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-[#C9A96E] transition-colors group"
                  >
                    <ImagePlus className="w-5 h-5 text-gray-300 group-hover:text-[#C9A96E] transition-colors" />
                    <span className="text-xs text-gray-400">Más</span>
                  </button>
                </div>
              )}

              {/* Drop zone when no images */}
              {pendingImages.length === 0 && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 text-center hover:border-[#C9A96E] transition-colors group"
                >
                  <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#C9A96E] mx-auto mb-2 transition-colors" />
                  <p className="text-sm text-[#7A7A7A]">Clic para subir imágenes</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — múltiples archivos</p>
                </button>
              )}

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <Label>Activo (visible en el catálogo)</Label>
              <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
            </div>
            <div className="flex items-center justify-between py-1">
              <Label>Destacado</Label>
              <Switch checked={form.isFeatured} onCheckedChange={(v) => set("isFeatured", v)} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {pendingImages.length > 0 ? "Subiendo imágenes..." : "Guardando..."}
                  </>
                ) : "Crear producto"}
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
