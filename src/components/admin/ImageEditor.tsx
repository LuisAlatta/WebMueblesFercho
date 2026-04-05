"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCw, RotateCcw, Loader2, Square, RectangleHorizontal, Maximize } from "lucide-react";

interface ImageEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onSave: (blob: Blob) => void | Promise<void>;
}

const ASPECT_OPTIONS = [
  { label: "3:5", value: 3 / 5, icon: RectangleHorizontal, hint: "Catálogo" },
  { label: "1:1", value: 1, icon: Square, hint: "" },
  { label: "Libre", value: 0, icon: Maximize, hint: "" },
] as const;

/** Crop the image on a canvas and return a Blob. */
async function getCroppedImage(
  imageSrc: string,
  crop: Area,
  rotation: number
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const rotRad = (rotation * Math.PI) / 180;

  // Bounding box of the rotated image
  const { width: bBoxW, height: bBoxH } = rotateSize(image.width, image.height, rotation);

  canvas.width = bBoxW;
  canvas.height = bBoxH;

  ctx.translate(bBoxW / 2, bBoxH / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // Extract the crop area
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d")!;

  croppedCanvas.width = crop.width;
  croppedCanvas.height = crop.height;

  croppedCtx.drawImage(
    canvas,
    crop.x, crop.y, crop.width, crop.height,
    0, 0, crop.width, crop.height
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas is empty"))),
      "image/jpeg",
      0.92
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export default function ImageEditor({ open, onOpenChange, imageUrl, onSave }: ImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [aspect, setAspect] = useState<number>(3 / 5);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  function resetState() {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedArea(null);
    setAspect(3 / 5);
  }

  async function handleSave() {
    if (!croppedArea) return;
    setSaving(true);
    try {
      const blob = await getCroppedImage(imageUrl, croppedArea, rotation);
      await onSave(blob);
    } finally {
      setSaving(false);
      resetState();
      onOpenChange(false);
    }
  }

  function handleClose(value: boolean) {
    if (!value) resetState();
    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Editar imagen</DialogTitle>
        </DialogHeader>

        {/* Cropper area */}
        <div className="relative w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect || undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          {/* Aspect ratio */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium w-20 shrink-0">Proporción</span>
            <div className="flex gap-1.5">
              {ASPECT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isActive = aspect === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setAspect(opt.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-slate-800 text-white shadow-sm"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {opt.label}
                    {opt.hint && (
                      <span className={`text-[10px] ${isActive ? "text-slate-400" : "text-slate-400"}`}>
                        ({opt.hint})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium w-20 shrink-0">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-1.5 accent-[#C9A96E] cursor-pointer"
            />
            <span className="text-xs text-slate-400 tabular-nums w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Rotation */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium w-20 shrink-0">Rotación</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setRotation((r) => r - 90)}
                className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                title="Rotar izquierda"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRotation((r) => r + 90)}
                className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                title="Rotar derecha"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-slate-400 tabular-nums">{rotation}°</span>
          </div>
        </div>

        <DialogFooter className="sm:flex-row gap-2">
          <Button variant="outline" onClick={() => handleClose(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#C9A96E] hover:bg-[#b8944f] text-white"
          >
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
