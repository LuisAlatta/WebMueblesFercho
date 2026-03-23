"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import SingleImageUpload from "@/components/admin/SingleImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function EditCategoriaPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    imagePublicId: "",
  });

  useEffect(() => {
    fetch(`/api/categorias/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          imageUrl: data.imageUrl ?? "",
          imagePublicId: data.imagePublicId ?? "",
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error al cargar la categoría");
        router.push("/admin/categorias");
      });
  }, [id]);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("El nombre es requerido"); return; }
    setSaving(true);
    const res = await fetch(`/api/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        description: form.description.trim() || null,
        imageUrl: form.imageUrl || null,
        imagePublicId: form.imagePublicId || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Categoría actualizada");
      router.push("/admin/categorias");
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Error al guardar");
    }
  }

  if (loading) {
    return (
      <>
        <AdminTopBar title="Editar categoría" />
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
        <Link
          href="/admin/categorias"
          className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#1C1C1E] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <div className="max-w-lg">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ej: Dormitorios"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Descripción breve de la categoría"
                rows={3}
              />
            </div>

            <SingleImageUpload
              value={form.imageUrl}
              onChange={(url, publicId) =>
                setForm((p) => ({ ...p, imageUrl: url, imagePublicId: publicId }))
              }
              onClear={() => setForm((p) => ({ ...p, imageUrl: "", imagePublicId: "" }))}
              folder="muebles-fercho/categorias"
              label="Imagen de la categoría"
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
              <Link href="/admin/categorias">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
