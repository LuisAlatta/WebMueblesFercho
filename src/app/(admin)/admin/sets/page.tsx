"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { type Column } from "@/components/admin/DataTable";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Sofa, Star } from "lucide-react";
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
  isFeatured: boolean;
  items: { id: number; product: { id: number; name: string } }[];
}

export default function CombosPage() {
  const [sets, setSets] = useState<ProductSet[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { confirm, dialogProps } = useConfirmDialog();

  async function load() {
    setLoading(true);
    const res = await fetch("/api/sets");
    if (res.ok) setSets(await res.json());
    else toast.error("Error al cargar combos");
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
      toast.success(set.isActive ? "Combo desactivado" : "Combo activado");
      load();
    } else toast.error("Error al actualizar");
  }

  async function togglePromo(set: ProductSet) {
    const res = await fetch(`/api/sets/${set.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !set.isFeatured }),
    });
    if (res.ok) {
      toast.success(set.isFeatured ? "Quitado de promociones" : "Agregado a promociones");
      load();
    } else toast.error("Error al actualizar");
  }

  function remove(set: ProductSet) {
    confirm({
      title: "Eliminar combo",
      itemName: set.name,
      description: "Los productos del combo no serán eliminados.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch(`/api/sets/${set.id}`, { method: "DELETE" });
        if (res.ok) { toast.success("Combo eliminado"); load(); }
        else toast.error("Error al eliminar");
      },
    });
  }

  const columns: Column<ProductSet>[] = [
    {
      key: "name",
      header: "Combo",
      cell: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
            {s.imageUrl ? (
              <Image src={s.imageUrl} alt={s.name} width={40} height={40} className="object-cover w-full h-full" />
            ) : (
              <Sofa className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900 truncate">{s.name}</p>
            {s.description && <p className="text-xs text-slate-500 truncate max-w-[200px]">{s.description}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Categoría",
      hideBelow: "lg",
      cell: (s) => s.category ? <Badge variant="secondary">{s.category.name}</Badge> : <span className="text-slate-400">—</span>,
    },
    {
      key: "products",
      header: "Productos",
      cell: (s) => <span className="text-slate-600 text-xs">{s.items.length} producto{s.items.length !== 1 ? "s" : ""}</span>,
    },
    {
      key: "promo",
      header: "Promo",
      cell: (s) => (
        <button
          onClick={(e) => { e.stopPropagation(); togglePromo(s); }}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
            s.isFeatured ? "bg-amber-50 text-amber-600" : "text-slate-400 hover:text-amber-500"
          }`}
        >
          <Star className={`w-4 h-4 ${s.isFeatured ? "fill-amber-500" : ""}`} />
          <span className="text-xs font-medium">{s.isFeatured ? "Sí" : "—"}</span>
        </button>
      ),
    },
    {
      key: "status",
      header: "Estado",
      cell: (s) => (
        <button
          onClick={(e) => { e.stopPropagation(); toggle(s); }}
          className="flex items-center gap-1.5 text-sm"
        >
          {s.isActive ? (
            <><ToggleRight className="w-5 h-5 text-emerald-500" /><span className="text-emerald-600 font-medium">Activo</span></>
          ) : (
            <><ToggleLeft className="w-5 h-5 text-slate-300" /><span className="text-slate-400">Inactivo</span></>
          )}
        </button>
      ),
    },
  ];

  return (
    <>
      <AdminTopBar title="Combos de productos" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          title="Combos"
          description="Agrupá productos que combinan bien juntos. Ej: 'Dormitorio completo'."
          icon={Sofa}
          actions={
            <Link href="/admin/sets/nuevo">
              <Button className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white h-9">
                <Plus className="w-4 h-4" /> Nuevo combo
              </Button>
            </Link>
          }
        />

        <DataTable
          data={sets}
          columns={columns}
          getRowKey={(s) => s.id}
          loading={loading}
          onRowClick={(s) => router.push(`/admin/sets/${s.id}`)}
          actions={(s) => (
            <>
              <Link href={`/admin/sets/${s.id}`} onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon-sm" aria-label="Editar"><Pencil className="w-3.5 h-3.5" /></Button>
              </Link>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => { e.stopPropagation(); remove(s); }}
                aria-label="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
          emptyState={
            <EmptyState
              icon={Sofa}
              title="No hay combos creados aún"
              description="Agrupá productos que combinan bien juntos para mostrarlos como combo."
              actionLabel="Crear primer combo"
              actionHref="/admin/sets/nuevo"
            />
          }
        />
      </main>

      <ConfirmDialog {...dialogProps} />
    </>
  );
}
