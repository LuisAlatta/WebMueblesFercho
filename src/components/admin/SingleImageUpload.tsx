"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (url: string, publicId: string) => void;
  onClear?: () => void;
  folder?: string;
  label?: string;
}

export default function SingleImageUpload({
  value,
  onChange,
  onClear,
  folder = "muebles-fercho",
  label = "Imagen",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const sigRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder }),
      });
      const { timestamp, signature, cloudName, apiKey, folder: f } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", f);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const uploaded = await uploadRes.json();

      if (!uploaded.secure_url) { toast.error("Error al subir imagen"); return; }
      onChange(uploaded.secure_url, uploaded.public_id);
    } catch {
      toast.error("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[#1C1C1E]">{label}</p>
      {value ? (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-100 group">
          <Image src={value} alt="Imagen" fill className="object-cover" sizes="128px" />
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#C9A96E] transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-[#C9A96E] animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5 text-gray-300" />
              <span className="text-xs text-[#7A7A7A]">Subir</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />
    </div>
  );
}
