"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, Upload, GripVertical } from "lucide-react";
import { toast } from "sonner";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  async function loadImages() {
    const res = await fetch(`/api/productos/${productId}/imagenes`);
    const data = await res.json();
    setImages(data);
  }

  useEffect(() => { loadImages(); }, [productId]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        // 1. Get signed upload params from server
        const sigRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: "muebles-fercho/productos" }),
        });
        const { timestamp, signature, cloudName, apiKey, folder } = await sigRes.json();

        // 2. Upload directly to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );
        const uploaded = await uploadRes.json();

        if (!uploaded.secure_url) {
          toast.error(`Error subiendo ${file.name}`);
          continue;
        }

        // 3. Save to DB
        await fetch(`/api/productos/${productId}/imagenes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: uploaded.secure_url, publicId: uploaded.public_id as string }),
        });
      } catch {
        toast.error(`Error subiendo ${file.name}`);
      }
    }

    setUploading(false);
    loadImages();
    toast.success("Imágenes subidas");
  }

  async function deleteImage(img: ProductImage) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    await fetch(`/api/productos/${productId}/imagenes`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: img.id, publicId: img.publicId }),
    });
    toast.success("Imagen eliminada");
    loadImages();
  }

  async function saveOrder(reordered: ProductImage[]) {
    await fetch(`/api/productos/${productId}/imagenes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: reordered.map((img, i) => ({ id: img.id, order: i })) }),
    });
  }

  function onDragStart(index: number) {
    dragItem.current = index;
  }

  function onDragEnter(index: number) {
    dragOverItem.current = index;
  }

  function onDragEnd() {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

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
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Subiendo..." : "Subir imágenes"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
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
              <Image
                src={img.url}
                alt="Imagen producto"
                fill
                className="object-cover"
                sizes="150px"
              />
              {index === 0 && (
                <span className="absolute top-1 left-1 text-xs bg-[#C9A96E] text-[#1C1C1E] px-1.5 py-0.5 rounded font-medium">
                  Principal
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <GripVertical className="w-5 h-5 text-white" />
                <button
                  type="button"
                  onClick={() => deleteImage(img)}
                  className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl py-10 text-center hover:border-[#C9A96E] transition-colors group"
        >
          <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#C9A96E] mx-auto mb-2 transition-colors" />
          <p className="text-sm text-[#7A7A7A]">Hacé clic para subir imágenes</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — múltiples archivos</p>
        </button>
      )}
    </div>
  );
}
