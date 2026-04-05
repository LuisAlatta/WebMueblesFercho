"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, Upload, GripVertical, Crop } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog, { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import ImageEditor from "@/components/admin/ImageEditor";

interface ProductImage {
  id: number;
  url: string;
  publicId: string;
  order: number;
}

interface Props {
  productId: number;
}

export default function ImageUpload({ productId }: Props) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const { confirm, dialogProps } = useConfirmDialog();

  async function loadImages() {
    const res = await fetch(`/api/productos/${productId}/imagenes`);
    setImages(await res.json());
  }

  useEffect(() => { loadImages(); }, [productId]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "productos");

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) { toast.error(`Error subiendo ${file.name}`); continue; }
        const { url, path } = await res.json();

        await fetch(`/api/productos/${productId}/imagenes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, publicId: path }),
        });
      } catch {
        toast.error(`Error subiendo ${file.name}`);
      }
    }

    setUploading(false);
    loadImages();
    toast.success("Imágenes subidas");
  }

  function deleteImage(img: ProductImage) {
    confirm({
      title: "Eliminar imagen",
      description: "Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      variant: "danger",
      onConfirm: async () => {
        await fetch(`/api/productos/${productId}/imagenes`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: img.id, publicId: img.publicId }),
        });
        toast.success("Imagen eliminada");
        loadImages();
      },
    });
  }

  async function handleEditSave(blob: Blob) {
    if (!editingImage) return;

    // 1. Upload the new cropped image
    const formData = new FormData();
    formData.append("file", blob, "edited.jpg");
    formData.append("folder", "productos");

    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
    if (!uploadRes.ok) {
      toast.error("Error subiendo imagen editada");
      return;
    }
    const { url, path } = await uploadRes.json();

    // 2. Replace the image record (update URL + delete old file)
    const replaceRes = await fetch(`/api/productos/${productId}/imagenes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingImage.id,
        url,
        publicId: path,
        oldPublicId: editingImage.publicId,
      }),
    });

    if (replaceRes.ok) {
      toast.success("Imagen editada");
      loadImages();
    } else {
      toast.error("Error al guardar imagen editada");
    }
  }

  async function saveOrder(reordered: ProductImage[]) {
    await fetch(`/api/productos/${productId}/imagenes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: reordered.map((img, i) => ({ id: img.id, order: i })) }),
    });
  }

  function onDragStart(index: number) { dragItem.current = index; }
  function onDragEnter(index: number) { dragOverItem.current = index; }
  function onDragEnd() {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;
    const reordered = [...images];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, moved);
    dragItem.current = null;
    dragOverItem.current = null;
    setImages(reordered);
    saveOrder(reordered);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#7A7A7A]">
          {images.length === 0
            ? "Sin imágenes — la primera será la principal"
            : `${images.length} imagen(es) — arrastrá para reordenar`}
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 text-sm bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? "Subiendo..." : "Subir imágenes"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragEnter={() => onDragEnter(index)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="relative group rounded-lg overflow-hidden border border-gray-100 aspect-square bg-gray-50 cursor-grab active:cursor-grabbing"
            >
              <Image src={img.url} alt="Imagen producto" fill className="object-cover" sizes="150px" />
              {index === 0 && (
                <span className="absolute top-1 left-1 text-xs bg-[#C9A96E] text-[#1C1C1E] px-1.5 py-0.5 rounded font-medium">
                  Principal
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <GripVertical className="w-5 h-5 text-white" />
                <button
                  type="button"
                  onClick={() => setEditingImage(img)}
                  className="p-1.5 bg-white/90 rounded-full text-slate-700 hover:bg-white transition-colors"
                  title="Editar imagen"
                >
                  <Crop className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => deleteImage(img)}
                  className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl py-10 text-center hover:border-[#C9A96E] transition-colors group">
          <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#C9A96E] mx-auto mb-2 transition-colors" />
          <p className="text-sm text-[#7A7A7A]">Hacé clic para subir imágenes</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — múltiples archivos</p>
        </button>
      )}

      {/* Image editor modal */}
      {editingImage && (
        <ImageEditor
          open={!!editingImage}
          onOpenChange={(open) => { if (!open) setEditingImage(null); }}
          imageUrl={editingImage.url}
          onSave={handleEditSave}
        />
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
