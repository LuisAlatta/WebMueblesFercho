"use client";

import { useEffect, useRef, useState } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface FileEntry {
  file: File;
  preview: string;
  name: string; // editable product name
}

type UploadStatus = "idle" | "uploading" | "done";

export default function CargaMasivaPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<{ created: number; errors: string[] } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => toast.error("Error cargando categorías"));
  }, []);

  function fileNameToProductName(fileName: string): string {
    const name = fileName.replace(/\.[^/.]+$/, ""); // remove extension
    return name
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newEntries: FileEntry[] = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: fileNameToProductName(file.name),
      }));
    setFiles((prev) => [...prev, ...newEntries]);
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function updateName(index: number, newName: string) {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, name: newName } : f)));
  }

  async function createCategory() {
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const res = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (!res.ok) throw new Error();
      const cat: Category = await res.json();
      setCategories((prev) => [...prev, cat]);
      setSelectedCategoryId(cat.id);
      setNewCategoryName("");
      toast.success(`Categoría "${cat.name}" creada`);
    } catch {
      toast.error("Error creando categoría");
    }
    setCreatingCategory(false);
  }

  async function startUpload() {
    if (!selectedCategoryId || files.length === 0) return;

    setStatus("uploading");
    setResult(null);
    setProgress({ current: 0, total: files.length });

    // Step 1: Upload all images to storage
    const uploaded: { name: string; url: string; publicId: string }[] = [];
    const uploadErrors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const entry = files[i];
      setProgress({ current: i + 1, total: files.length });

      try {
        const formData = new FormData();
        formData.append("file", entry.file);
        formData.append("folder", "productos");

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { url, path } = await res.json();
        uploaded.push({ name: entry.name, url, publicId: path });
      } catch (err) {
        uploadErrors.push(
          `${entry.name}: ${err instanceof Error ? err.message : "Error de subida"}`
        );
      }
    }

    // Step 2: Create products in bulk
    if (uploaded.length > 0) {
      try {
        const res = await fetch("/api/productos/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryId: selectedCategoryId,
            products: uploaded,
          }),
        });
        const data = await res.json();
        setResult({
          created: data.created ?? 0,
          errors: [...uploadErrors, ...(data.errors ?? [])],
        });
      } catch {
        setResult({
          created: 0,
          errors: [...uploadErrors, "Error al crear productos en base de datos"],
        });
      }
    } else {
      setResult({ created: 0, errors: uploadErrors });
    }

    setStatus("done");
    setFiles([]);
  }

  function reset() {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setStatus("idle");
    setResult(null);
    setProgress({ current: 0, total: 0 });
  }

  const pct =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <>
      <AdminTopBar title="Carga masiva de productos" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Result summary */}
        {status === "done" && result && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h2 className="font-semibold text-[#1C1C1E]">Carga completada</h2>
            </div>
            <p className="text-sm text-[#7A7A7A]">
              {result.created} producto(s) creado(s) exitosamente.
            </p>
            {result.errors.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {result.errors.length} error(es):
                </p>
                <ul className="text-xs text-red-400 space-y-0.5 max-h-32 overflow-y-auto">
                  {result.errors.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={reset} variant="outline" size="sm">
              Nueva carga
            </Button>
          </div>
        )}

        {/* Upload form */}
        {status !== "done" && (
          <>
            {/* Category selector */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 max-w-xl">
              <h2 className="font-semibold text-[#1C1C1E]">1. Seleccionar categoría</h2>
              <div className="space-y-2">
                <Label>Categoría existente</Label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) =>
                    setSelectedCategoryId(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50"
                >
                  <option value="">— Elegir categoría —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#7A7A7A]">
                <div className="flex-1 border-t border-gray-100" />
                o crear nueva
                <div className="flex-1 border-t border-gray-100" />
              </div>
              <div className="flex gap-2">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nombre de nueva categoría"
                  onKeyDown={(e) => e.key === "Enter" && createCategory()}
                />
                <Button
                  onClick={createCategory}
                  disabled={creatingCategory || !newCategoryName.trim()}
                  className="bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white shrink-0"
                >
                  {creatingCategory ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Crear"
                  )}
                </Button>
              </div>
            </div>

            {/* File drop zone */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <h2 className="font-semibold text-[#1C1C1E]">2. Seleccionar imágenes</h2>
              <p className="text-xs text-[#7A7A7A]">
                Cada imagen se convertirá en un producto. El nombre se genera del archivo
                y podés editarlo antes de subir.
              </p>

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={status === "uploading"}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 text-center hover:border-[#C9A96E] transition-colors group disabled:opacity-50"
              >
                <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#C9A96E] mx-auto mb-2 transition-colors" />
                <p className="text-sm text-[#7A7A7A]">
                  Hacé clic para seleccionar imágenes
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WEBP — seleccioná todas las fotos de la categoría
                </p>
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#1C1C1E]">
                    {files.length} imagen(es) seleccionadas
                  </p>
                  <div className="grid gap-2 max-h-[400px] overflow-y-auto">
                    {files.map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 bg-gray-50"
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-200 shrink-0 relative">
                          <Image
                            src={entry.preview}
                            alt={entry.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <Input
                          value={entry.name}
                          onChange={(e) => updateName(i, e.target.value)}
                          className="flex-1 text-sm h-9"
                          disabled={status === "uploading"}
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          disabled={status === "uploading"}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {status === "uploading" && (
              <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#7A7A7A] flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subiendo imágenes...
                  </span>
                  <span className="font-medium text-[#1C1C1E]">
                    {progress.current}/{progress.total} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A96E] rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload button */}
            {files.length > 0 && status === "idle" && (
              <Button
                onClick={startUpload}
                disabled={!selectedCategoryId}
                className="bg-[#C9A96E] hover:bg-[#b8944f] text-[#1C1C1E] font-medium px-6"
                size="lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Subir {files.length} producto(s)
              </Button>
            )}
          </>
        )}
      </main>
    </>
  );
}
