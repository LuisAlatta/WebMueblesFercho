"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import ProductEditor from "@/components/admin/ProductEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Star, StarOff, ImageOff, AlertTriangle, Package,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string };
  images: { url: string; isPrimary: boolean }[];
  _count: { variants: number };
  retailPrice: string | null;
  wholesalePrice: string | null;
}

function ProductSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3">
          <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-[#FAF9F7] border-b border-gray-100 px-5 py-3 flex gap-8">
        {["w-40", "w-24", "w-24", "w-24", "w-20", "w-20", "w-16", "w-12"].map((w, i) => (
          <Skeleton key={i} className={`h-4 ${w}`} />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="px-5 py-3 flex items-center gap-8 border-b border-gray-50 last:border-0">
          <div className="flex items-center gap-3 w-40">
            <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

function PriceCell({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (v: string) => Promise<void>;
}) {
  return (
    <Input
      type="number"
      min="0"
      step="0.01"
      defaultValue={value ?? ""}
      placeholder="—"
      className="h-8 w-28 text-sm"
      onClick={(e) => e.stopPropagation()}
      onBlur={(e) => {
        const v = e.target.value;
        const original = value ?? "";
        if (v !== original) onSave(v);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
    />
  );
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const { confirm, dialogProps } = useConfirmDialog();

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/productos?limit=100${search ? `&search=${search}` : ""}`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
    } else {
      toast.error("Error al cargar productos");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function toggle(id: number, field: "isActive" | "isFeatured", current: boolean) {
    const res = await fetch(`/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !current }),
    });
    if (res.ok) {
      toast.success(field === "isActive" ? (current ? "Desactivado" : "Activado") : (current ? "Quitado de promoción" : "Añadido a promoción"));
      load();
    } else {
      toast.error("Error al actualizar");
    }
  }

  async function updatePrice(id: number, field: "retailPrice" | "wholesalePrice", value: string) {
    const parsed = value === "" ? null : parseFloat(value);
    const res = await fetch(`/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: parsed }),
    });
    if (res.ok) {
      toast.success("Precio actualizado");
      load();
    } else {
      toast.error("Error al actualizar el precio");
    }
  }

  function deleteProduct(id: number, name: string) {
    confirm({
      title: `Eliminar "${name}"`,
      description: "Esta acción no se puede deshacer. Se eliminarán también las imágenes y variantes del producto.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success("Producto eliminado");
          load();
        } else {
          toast.error("Error al eliminar el producto");
        }
      },
    });
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setEditingName(p.name);
  }

  return (
    <>
      <AdminTopBar title="Productos" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <Input
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <Link href="/admin/productos/nuevo" className="sm:ml-auto">
            <Button className="w-full sm:w-auto bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
              <Plus className="w-4 h-4 mr-2" /> Nuevo producto
            </Button>
          </Link>
        </div>

        {loading ? (
          <>
            <div className="lg:hidden"><ProductSkeleton /></div>
            <div className="hidden lg:block"><TableSkeleton /></div>
          </>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No hay productos"
            description={search ? "No se encontraron productos con esa búsqueda." : "Creá tu primer producto para empezar."}
            actionLabel={search ? undefined : "+ Nuevo producto"}
            actionHref={search ? undefined : "/admin/productos/nuevo"}
          />
        ) : (
          <>
            {/* MOBILE */}
            <div className="lg:hidden space-y-3">
              <AnimatePresence>
                {products.map((p, i) => {
                  const img = p.images[0];
                  const noImage = p.images.length === 0;
                  const noPrice = p.retailPrice === null || p.wholesalePrice === null;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 hover:shadow-sm transition-shadow"
                    >
                      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {img ? (
                          <Image src={img.url} alt={p.name} width={64} height={64} className="object-cover w-full h-full" />
                        ) : (
                          <ImageOff className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-[#1C1C1E] text-sm leading-snug truncate">{p.name}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(p)}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => deleteProduct(p.id, p.name)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        <Badge variant="secondary" className="mt-1 text-xs">{p.category.name}</Badge>
                        {(noImage || noPrice) && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {noImage && (
                              <span className="inline-flex items-center gap-0.5 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                <AlertTriangle className="w-3 h-3" /> Sin imagen
                              </span>
                            )}
                            {noPrice && (
                              <span className="inline-flex items-center gap-0.5 text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                <AlertTriangle className="w-3 h-3" /> Faltan precios
                              </span>
                            )}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-[10px] text-[#7A7A7A] mb-0.5">Minorista (S/.)</p>
                            <PriceCell
                              value={p.retailPrice}
                              onSave={(v) => updatePrice(p.id, "retailPrice", v)}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] text-[#7A7A7A] mb-0.5">Mayorista (S/.)</p>
                            <PriceCell
                              value={p.wholesalePrice}
                              onSave={(v) => updatePrice(p.id, "wholesalePrice", v)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2.5">
                          <button onClick={() => toggle(p.id, "isActive", p.isActive)} className="flex items-center gap-1.5 text-xs">
                            {p.isActive
                              ? <><ToggleRight className="w-4 h-4 text-green-500" /><span className="text-green-600 font-medium">Activo</span></>
                              : <><ToggleLeft className="w-4 h-4 text-gray-400" /><span className="text-gray-400">Inactivo</span></>}
                          </button>
                          <button onClick={() => toggle(p.id, "isFeatured", p.isFeatured)} className="flex items-center gap-1.5 text-xs">
                            {p.isFeatured
                              ? <><Star className="w-3.5 h-3.5 text-[#C9A96E] fill-[#C9A96E]" /><span className="text-[#C9A96E] font-medium">En Promoción</span></>
                              : <><StarOff className="w-3.5 h-3.5 text-gray-300" /><span className="text-gray-400">Normal</span></>}
                          </button>
                          <span className="text-xs text-[#7A7A7A] ml-auto">{p._count.variants} var.</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* DESKTOP */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF9F7] border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Producto</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Categoría</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Minorista</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Mayorista</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Variantes</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Estado</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Promoción</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => {
                    const img = p.images[0];
                    const noImage = p.images.length === 0;
                    const noPrice = p.retailPrice === null || p.wholesalePrice === null;
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-[#FAF9F7] transition-colors cursor-pointer"
                        onClick={() => openEdit(p)}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                              {img ? (
                                <Image src={img.url} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                              ) : (
                                <ImageOff className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-[#1C1C1E]">{p.name}</p>
                              <div className="flex gap-1 mt-0.5">
                                {noImage && (
                                  <span className="inline-flex items-center gap-0.5 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                    <AlertTriangle className="w-3 h-3" /> Sin imagen
                                  </span>
                                )}
                                {noPrice && (
                                  <span className="inline-flex items-center gap-0.5 text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                    <AlertTriangle className="w-3 h-3" /> Faltan precios
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant="secondary">{p.category.name}</Badge>
                        </td>
                        <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                          <PriceCell
                            value={p.retailPrice}
                            onSave={(v) => updatePrice(p.id, "retailPrice", v)}
                          />
                        </td>
                        <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                          <PriceCell
                            value={p.wholesalePrice}
                            onSave={(v) => updatePrice(p.id, "wholesalePrice", v)}
                          />
                        </td>
                        <td className="px-5 py-3 text-[#7A7A7A]">
                          {p._count.variants} variante{p._count.variants !== 1 ? "s" : ""}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggle(p.id, "isActive", p.isActive); }}
                            className="flex items-center gap-1.5 text-sm"
                          >
                            {p.isActive
                              ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Activo</span></>
                              : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-400">Inactivo</span></>}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggle(p.id, "isFeatured", p.isFeatured); }}
                            className="flex items-center gap-1.5 text-sm"
                          >
                            {p.isFeatured
                              ? <Star className="w-4 h-4 text-[#C9A96E] fill-[#C9A96E]" />
                              : <StarOff className="w-4 h-4 text-gray-300" />}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="ghost" size="sm" className="h-8 w-8 p-0"
                              onClick={(e) => { e.stopPropagation(); openEdit(p); }}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="sm"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={(e) => { e.stopPropagation(); deleteProduct(p.id, p.name); }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      <Dialog
        open={editingId !== null}
        onOpenChange={(open) => {
          if (!open) { setEditingId(null); load(); }
        }}
      >
        <DialogContent className="max-w-5xl w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto bg-[#FAF9F7] p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle>Editar: {editingName}</DialogTitle>
          </DialogHeader>
          {editingId !== null && (
            <ProductEditor
              productId={editingId}
              onSaved={load}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog {...dialogProps} />
    </>
  );
}
