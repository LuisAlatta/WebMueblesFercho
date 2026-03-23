"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2, Sofa } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface ProductSet {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  imageUrl: string | null;
  description: string | null;
  category: { name: string } | null;
  items: { id: number; product: { id: number; name: string } }[];
}

export default function SetsPage() {
  const [sets, setSets] = useState<ProductSet[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/sets");
    if (res.ok) {
      const data = await res.json();
      setSets(data);
    } else {
      toast.error("Error al cargar sets");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggle(set: ProductSet) {
    const res = await fetch(`/api/sets/${set.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !set.isActive }),
    });
    if (res.ok) {
      toast.success(set.isActive ? "Set desactivado" : "Set activado");
      load();
    } else {
      toast.error("Error al actualizar");
    }
  }

  async function remove(set: ProductSet) {
    if (!confirm(`¿Eliminar el set "${set.name}"?`)) return;
    const res = await fetch(`/api/sets/${set.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Set eliminado");
      load();
    } else {
      toast.error("Error al eliminar");
    }
  }

  return (
    <>
      <AdminTopBar title="Sets de productos" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1">
            <p className="text-sm text-[#7A7A7A]">
              Agrupa productos que combinan bien juntos. Ej: &quot;Dormitorio completo&quot;.
            </p>
          </div>
          <Link href="/admin/sets/nuevo" className="sm:ml-auto">
            <Button className="w-full sm:w-auto bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
              <Plus className="w-4 h-4 mr-2" /> Nuevo set
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#7A7A7A]" />
          </div>
        ) : sets.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
            <Sofa className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-[#7A7A7A]">No hay sets creados aún.</p>
            <Link href="/admin/sets/nuevo">
              <Button className="mt-4 bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white text-sm">
                <Plus className="w-4 h-4 mr-2" /> Crear primer set
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="lg:hidden space-y-3">
              {sets.map((set) => (
                <div key={set.id} className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {set.imageUrl ? (
                      <Image src={set.imageUrl} alt={set.name} width={56} height={56} className="object-cover w-full h-full" />
                    ) : (
                      <Sofa className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-[#1C1C1E] text-sm truncate">{set.name}</p>
                      <div className="flex gap-1 shrink-0">
                        <Link href={`/admin/sets/${set.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Pencil className="w-3.5 h-3.5" /></Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => remove(set)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {set.category && <Badge variant="secondary" className="text-xs">{set.category.name}</Badge>}
                      <span className="text-xs text-[#7A7A7A]">{set.items.length} producto{set.items.length !== 1 ? "s" : ""}</span>
                      <button onClick={() => toggle(set)} className="flex items-center gap-1 text-xs">
                        {set.isActive
                          ? <><ToggleRight className="w-4 h-4 text-green-500" /><span className="text-green-600 font-medium">Activo</span></>
                          : <><ToggleLeft className="w-4 h-4 text-gray-400" /><span className="text-gray-400">Inactivo</span></>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF9F7] border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Set</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Categoría</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Productos</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Estado</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sets.map((set) => (
                    <tr key={set.id} className="hover:bg-[#FAF9F7] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {set.imageUrl
                              ? <Image src={set.imageUrl} alt={set.name} width={40} height={40} className="object-cover w-full h-full" />
                              : <Sofa className="w-4 h-4 text-gray-400" />}
                          </div>
                          <div>
                            <p className="font-medium text-[#1C1C1E]">{set.name}</p>
                            {set.description && <p className="text-xs text-[#7A7A7A] truncate max-w-[200px]">{set.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {set.category ? <Badge variant="secondary">{set.category.name}</Badge> : <span className="text-[#7A7A7A]">—</span>}
                      </td>
                      <td className="px-5 py-3 text-[#7A7A7A]">
                        {set.items.length} producto{set.items.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => toggle(set)} className="flex items-center gap-1.5 text-sm">
                          {set.isActive
                            ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Activo</span></>
                            : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-400">Inactivo</span></>}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/sets/${set.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Pencil className="w-3.5 h-3.5" /></Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => remove(set)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </>
  );
}
