"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { type Column } from "@/components/admin/DataTable";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Tag,
  Search,
} from "lucide-react";
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

  useEffect(() => {
    load();
  }, []);

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
      title: "Eliminar categoría",
      itemName: cat.name,
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch(`/api/categorias/${cat.id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success("Categoría eliminada");
          load();
        } else {
          toast.error("Error al eliminar la categoría");
        }
      },
    });
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Nombre",
      cell: (c) => (
        <span className="font-medium text-slate-900">{c.name}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      hideBelow: "md",
      cell: (c) => (
        <code className="text-xs text-slate-500 font-mono">{c.slug}</code>
      ),
    },
    {
      key: "products",
      header: "Productos",
      cell: (c) => (
        <Badge variant="secondary" className="text-xs">
          {c._count.products}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Estado",
      cell: (c) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleActive(c);
          }}
          className="flex items-center gap-1.5 text-sm"
        >
          {c.isActive ? (
            <>
              <ToggleRight className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-600 font-medium">Activa</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5 text-slate-300" />
              <span className="text-slate-400">Inactiva</span>
            </>
          )}
        </button>
      ),
    },
  ];

  function rowActions(c: Category) {
    return (
      <>
        <Link
          href={`/admin/categorias/${c.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon-sm" aria-label="Editar">
            <Pencil className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-red-400 hover:text-red-600 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            deleteCategory(c);
          }}
          aria-label="Eliminar"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </>
    );
  }

  return (
    <>
      <AdminTopBar title="Categorías" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          title="Categorías"
          description="Organizá los productos del catálogo en categorías."
          icon={Tag}
          actions={
            <Link href="/admin/categorias/nueva">
              <Button className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white h-9">
                <Plus className="w-4 h-4" /> Nueva categoría
              </Button>
            </Link>
          }
        >
          <div className="relative max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Buscar categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9"
            />
          </div>
        </PageHeader>

        <DataTable
          data={filtered}
          columns={columns}
          getRowKey={(c) => c.id}
          loading={loading}
          onRowClick={(c) => router.push(`/admin/categorias/${c.id}`)}
          actions={rowActions}
          emptyState={
            search ? (
              <div className="bg-white rounded-xl border border-slate-200/70 px-5 py-10 text-center text-slate-500 text-sm">
                No se encontraron categorías para “{search}”.
              </div>
            ) : (
              <EmptyState
                icon={Tag}
                title="No hay categorías"
                description="Creá tu primera categoría para empezar a organizar el catálogo."
                actionLabel="+ Nueva categoría"
                actionHref="/admin/categorias/nueva"
              />
            )
          }
        />
      </main>

      <ConfirmDialog {...dialogProps} />
    </>
  );
}
