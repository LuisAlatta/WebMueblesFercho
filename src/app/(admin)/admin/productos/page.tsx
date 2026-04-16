"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import PageHeader from "@/components/admin/PageHeader";
import DataTable, { type Column } from "@/components/admin/DataTable";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import ProductEditor from "@/components/admin/ProductEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Star, StarOff, ImageOff, AlertTriangle, Package, Search,
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
  retailPrice: string | null;
  wholesalePrice: string | null;
}

function PriceCell({ value, onSave }: { value: string | null; onSave: (v: string) => Promise<void> }) {
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
        if (v !== (value ?? "")) onSave(v);
      }}
      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
    />
  );
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const { confirm, dialogProps } = useConfirmDialog();

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/productos?limit=100${search ? `&search=${search}` : ""}`);
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
    } else toast.error("Error al cargar productos");
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
      toast.success(field === "isActive" ? (current ? "Desactivado" : "Activado") : (current ? "Quitado de promoción" : "En promoción"));
      load();
    } else toast.error("Error al actualizar");
  }

  async function updatePrice(id: number, field: "retailPrice" | "wholesalePrice", value: string) {
    const parsed = value === "" ? null : parseFloat(value);
    const res = await fetch(`/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: parsed }),
    });
    if (res.ok) { toast.success("Precio actualizado"); load(); }
    else toast.error("Error al actualizar el precio");
  }

  function deleteProduct(p: Product) {
    confirm({
      title: "Eliminar producto",
      itemName: p.name,
      description: "Se eliminarán también las imágenes y variantes.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        const res = await fetch(`/api/productos/${p.id}`, { method: "DELETE" });
        if (res.ok) { toast.success("Producto eliminado"); load(); }
        else toast.error("Error al eliminar el producto");
      },
    });
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setEditingName(p.name);
  }

  function Warnings({ p }: { p: Product }) {
    const noImage = p.images.length === 0;
    const noPrice = p.retailPrice === null || p.wholesalePrice === null;
    if (!noImage && !noPrice) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-1">
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
    );
  }

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Producto",
      cell: (p) => {
        const img = p.images[0];
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
              {img ? (
                <Image src={img.url} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
              ) : (
                <ImageOff className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{p.name}</p>
              <Warnings p={p} />
            </div>
          </div>
        );
      },
    },
    {
      key: "category",
      header: "Categoría",
      hideBelow: "lg",
      cell: (p) => <Badge variant="secondary">{p.category.name}</Badge>,
    },
    {
      key: "retail",
      header: "Minorista",
      hideBelow: "lg",
      cell: (p) => <PriceCell value={p.retailPrice} onSave={(v) => updatePrice(p.id, "retailPrice", v)} />,
    },
    {
      key: "wholesale",
      header: "Mayorista",
      hideBelow: "lg",
      cell: (p) => <PriceCell value={p.wholesalePrice} onSave={(v) => updatePrice(p.id, "wholesalePrice", v)} />,
    },
    {
      key: "variants",
      header: "Var.",
      hideBelow: "xl",
      cell: (p) => <span className="text-slate-500 text-xs">{p._count.variants}</span>,
    },
    {
      key: "status",
      header: "Estado",
      cell: (p) => (
        <button onClick={(e) => { e.stopPropagation(); toggle(p.id, "isActive", p.isActive); }} className="flex items-center gap-1.5 text-sm">
          {p.isActive
            ? <><ToggleRight className="w-5 h-5 text-emerald-500" /><span className="text-emerald-600 font-medium">Activo</span></>
            : <><ToggleLeft className="w-5 h-5 text-slate-300" /><span className="text-slate-400">Inactivo</span></>}
        </button>
      ),
    },
    {
      key: "promo",
      header: "Promo",
      cell: (p) => (
        <button onClick={(e) => { e.stopPropagation(); toggle(p.id, "isFeatured", p.isFeatured); }} className="flex items-center gap-1.5 text-sm">
          {p.isFeatured
            ? <Star className="w-4 h-4 text-[#C9A96E] fill-[#C9A96E]" />
            : <StarOff className="w-4 h-4 text-slate-300" />}
        </button>
      ),
    },
  ];

  function mobileCard(p: Product) {
    const img = p.images[0];
    return (
      <div className="flex gap-3">
        <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
          {img ? (
            <Image src={img.url} alt={p.name} width={64} height={64} className="object-cover w-full h-full" />
          ) : (
            <ImageOff className="w-5 h-5 text-slate-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 text-sm leading-snug truncate">{p.name}</p>
          <Badge variant="secondary" className="mt-1 text-xs">{p.category.name}</Badge>
          <Warnings p={p} />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-[10px] text-slate-500 mb-0.5">Minorista</p>
              <PriceCell value={p.retailPrice} onSave={(v) => updatePrice(p.id, "retailPrice", v)} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-0.5">Mayorista</p>
              <PriceCell value={p.wholesalePrice} onSave={(v) => updatePrice(p.id, "wholesalePrice", v)} />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2.5">
            <button onClick={() => toggle(p.id, "isActive", p.isActive)} className="flex items-center gap-1.5 text-xs">
              {p.isActive
                ? <><ToggleRight className="w-4 h-4 text-emerald-500" /><span className="text-emerald-600 font-medium">Activo</span></>
                : <><ToggleLeft className="w-4 h-4 text-slate-400" /><span className="text-slate-400">Inactivo</span></>}
            </button>
            <button onClick={() => toggle(p.id, "isFeatured", p.isFeatured)} className="flex items-center gap-1.5 text-xs">
              {p.isFeatured
                ? <><Star className="w-3.5 h-3.5 text-[#C9A96E] fill-[#C9A96E]" /><span className="text-[#C9A96E] font-medium">Promo</span></>
                : <><StarOff className="w-3.5 h-3.5 text-slate-300" /><span className="text-slate-400">Normal</span></>}
            </button>
            <span className="text-xs text-slate-500 ml-auto">{p._count.variants} var.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminTopBar title="Productos" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <PageHeader
          title="Productos"
          description="Todos los productos del catálogo."
          icon={Package}
          actions={
            <Link href="/admin/productos/nuevo">
              <Button className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white h-9">
                <Plus className="w-4 h-4" /> Nuevo producto
              </Button>
            </Link>
          }
        >
          <div className="relative max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9"
            />
          </div>
        </PageHeader>

        <DataTable
          data={products}
          columns={columns}
          getRowKey={(p) => p.id}
          loading={loading}
          skeletonRows={6}
          onRowClick={openEdit}
          mobileCard={mobileCard}
          actions={(p) => (
            <>
              <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); openEdit(p); }} aria-label="Editar">
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => { e.stopPropagation(); deleteProduct(p); }}
                aria-label="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
          emptyState={
            <EmptyState
              icon={Package}
              title="No hay productos"
              description={search ? `No se encontraron productos para "${search}".` : "Creá tu primer producto para empezar."}
              actionLabel={search ? undefined : "+ Nuevo producto"}
              actionHref={search ? undefined : "/admin/productos/nuevo"}
            />
          }
        />
      </main>

      <Dialog
        open={editingId !== null}
        onOpenChange={(open) => { if (!open) { setEditingId(null); load(); } }}
      >
        <DialogContent className="max-w-5xl w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto bg-[#F6F7F9] p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle>Editar: {editingName}</DialogTitle>
          </DialogHeader>
          {editingId !== null && <ProductEditor productId={editingId} onSaved={load} />}
        </DialogContent>
      </Dialog>

      <ConfirmDialog {...dialogProps} />
    </>
  );
}
