"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
  id: number;
  url: string;
  caption: string | null;
}

export default function StoreLocationGallery({ photos }: { photos: Photo[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? null : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, photos.length]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setOpenIdx(idx)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 hover:border-[#C9A96E]/60 transition-colors"
          >
            <Image
              src={p.url}
              alt={p.caption ?? `Referencia ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(min-width: 768px) 25vw, 50vw"
            />
            {p.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-xs text-white text-left line-clamp-2">{p.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {openIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setOpenIdx(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setOpenIdx(null); }}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            aria-label="Cerrar"
          >
            <X className="w-7 h-7" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setOpenIdx((i) => i === null ? null : (i - 1 + photos.length) % photos.length); }}
                className="absolute left-2 sm:left-4 text-white/80 hover:text-white p-2"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setOpenIdx((i) => i === null ? null : (i + 1) % photos.length); }}
                className="absolute right-2 sm:right-4 text-white/80 hover:text-white p-2"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          <div
            className="relative w-[92vw] h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[openIdx].url}
              alt={photos[openIdx].caption ?? ""}
              fill
              className="object-contain"
              sizes="92vw"
              priority
            />
            {photos[openIdx].caption && (
              <p className="absolute bottom-2 left-0 right-0 text-center text-sm text-white/90 px-4">
                {photos[openIdx].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
