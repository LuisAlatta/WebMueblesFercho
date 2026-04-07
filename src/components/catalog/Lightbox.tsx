"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxProps {
  images: { id: number; url: string; altText: string | null }[];
  selectedIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  productName: string;
}

export default function Lightbox({ images, selectedIndex, onClose, onPrev, onNext, productName }: LightboxProps) {
  const image = images[selectedIndex];
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button className="absolute top-4 right-4 text-white/70 hover:text-white">
        <X className="w-7 h-7" />
      </button>
      <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
        <Image
          src={image.url}
          alt={image.altText ?? productName}
          fill className="object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
