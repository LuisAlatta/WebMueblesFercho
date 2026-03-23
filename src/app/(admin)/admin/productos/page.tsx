"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Star, StarOff, Loader2, ImageOff, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  category: { name: string };
  images: { url: string; isPrimary: boolean }[];
  _count: { variants: number };
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/productos?limit=100${search ? `&search=${search}` : ""}`);
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function toggle(id: number, field: "isActive" | "isFeatured", current: boolean) {
    await fetch(`/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !current }),
    });
    toast.success("Actualizado");
    load();
  }

  async function deleteProduct(id: number, name: string) {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    await fetch(`/api/productos/${id}`, { method: "DELETE" });
    toast.success("Producto eliminado");
    load();
  }

  return (
    <>
      <AdminTopBar title="Productos" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Input
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Link href="/admin/productos/nuevo">
            <Button className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
              <Plus className="w-4 h-4 mr-2" /> Nuevo producto
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#7A7A7A]" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#FAF9F7] border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Producto</th>
                  <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Categoría</th>
                  <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Variantes</th>
                  <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Estado</th>
                  <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Destacado</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => {
                  const img = p.images[0];
                  const noImage = p.images.length === 0;
                  const noVariants = p._count.variants === 0;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF9F7] transition-colors">
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
                              {noVariants && (
                                <span className="inline-flex items-center gap-0.5 text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                  <AlertTriangle className="w-3 h-3" /> Sin precio
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant="secondary">{p.category.name}</Badge>
                      </td>
                      <td className="px-5 py-3 text-[#7A7A7A]">
                        {p._count.variants} variante{p._count.variants !== 1 ? "s" : ""}
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => toggle(p.id, "isActive", p.isActive)} className="flex items-center gap-1.5 text-sm">
                          {p.isActive
                            ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Activo</span></>
                            : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-400">Inactivo</span></>}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => toggle(p.id, "isFeatured", p.isFeatured)} className="flex items-center gap-1.5 text-sm">
                          {p.isFeatured
                            ? <Star className="w-4 h-4 text-[#C9A96E] fill-[#C9A96E]" />
                            : <StarOff className="w-4 h-4 text-gray-300" />}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/productos/${p.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost" size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => deleteProduct(p.id, p.name)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-[#7A7A7A]">
                      No hay productos.{" "}
                      <Link href="/admin/productos/nuevo" className="text-[#C9A96E] hover:underline">
                        Crear el primero
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
