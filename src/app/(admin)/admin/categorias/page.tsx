"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Tag } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
  _count: { products: number };
}

export default function CategoriasPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { confirm, dialogProps } = useConfirmDialog();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/categorias");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    } else {
      toast.error("Error al cargar categorias");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleActive(cat: Category) {
    const res = await fetch(`/api/categorias/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !cat.isActive }),
    });
    if (res.ok) {
      toast.success(`Categoria ${!cat.isActive ? "activada" : "desactivada"}`);
      load();
    } else {
      toast.error("Error al actualizar");
    }
  }

  function deleteCategory(cat: Category) {
    if (cat._count.products > 0) {
      toast.error(`No se puede eliminar: tiene ${cat._count.products} producto(s)`);
      return;
    }
    confirm({
      title: `Eliminar "${cat.name}"`,
      description: "Esta accion no se puede deshacer. La categoria sera eliminada permanentemente.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch(`/api/categorias/${cat.id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success("Categoria eliminada");
          load();
        } else {
          toast.error("Error al eliminar la categoria");
        }
      },
    });
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AdminTopBar title="Categorias" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <Input
            placeholder="Buscar categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <Link href="/admin/categorias/nueva" className="sm:ml-auto">
            <Button className="w-full sm:w-auto bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white">
              <Plus className="w-4 h-4 mr-2" /> Nueva categoria
            </Button>
          </Link>
        </div>

        {loading ? (
          /* ── Skeleton loader ───────────────────────────────── */
          <>
            {/* Mobile skeleton */}
            <div className="lg:hidden space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3"
                >
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <div className="flex items-center gap-3 mt-2">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-4 w-14" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop skeleton */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF9F7] border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Nombre</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Slug</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Productos</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Estado</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-5 py-3"><Skeleton className="h-4 w-28" /></td>
                      <td className="px-5 py-3"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-5 py-3"><Skeleton className="h-5 w-10 rounded-full" /></td>
                      <td className="px-5 py-3"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : filtered.length === 0 ? (
          search ? (
            <div className="bg-white rounded-xl border border-gray-100 px-5 py-8 text-center text-[#7A7A7A]">
              No se encontraron categorias
            </div>
          ) : (
            <EmptyState
              icon={Tag}
              title="No hay categorias"
              description="Crea tu primera categoria."
              actionLabel="+ Nueva categoria"
              actionHref="/admin/categorias/nueva"
            />
          )
        ) : (
          <>
            {/* ── MOBILE: cards ─────────────────────────────────── */}
            <div className="lg:hidden space-y-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1C1C1E] text-sm">{cat.name}</p>
                      <p className="text-xs text-[#7A7A7A] font-mono mt-0.5 truncate">{cat.slug}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {cat._count.products} producto{cat._count.products !== 1 ? "s" : ""}
                        </Badge>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleActive(cat); }}
                          className="flex items-center gap-1 text-xs"
                        >
                          {cat.isActive ? (
                            <><ToggleRight className="w-4 h-4 text-green-500" /><span className="text-green-600 font-medium">Activa</span></>
                          ) : (
                            <><ToggleLeft className="w-4 h-4 text-gray-400" /><span className="text-gray-400">Inactiva</span></>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link href={`/admin/categorias/${cat.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteCategory(cat)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── DESKTOP: table ────────────────────────────────── */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF9F7] border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Nombre</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Slug</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Productos</th>
                    <th className="text-left px-5 py-3 font-medium text-[#7A7A7A]">Estado</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((cat, i) => (
                      <motion.tr
                        key={cat.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                        onClick={() => router.push(`/admin/categorias/${cat.id}`)}
                        className="hover:bg-[#FAF9F7] transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3 font-medium text-[#1C1C1E]">{cat.name}</td>
                        <td className="px-5 py-3 text-[#7A7A7A] font-mono text-xs">{cat.slug}</td>
                        <td className="px-5 py-3">
                          <Badge variant="secondary">{cat._count.products}</Badge>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleActive(cat); }}
                            className="flex items-center gap-1.5 text-sm"
                          >
                            {cat.isActive ? (
                              <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Activa</span></>
                            ) : (
                              <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-400">Inactiva</span></>
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <Link
                              href={`/admin/categorias/${cat.id}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={(e) => { e.stopPropagation(); deleteCategory(cat); }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      <ConfirmDialog {...dialogProps} />
    </>
  );
}
