"use client";

import { useRef, useCallback, useState } from "react";
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
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastDistance = useRef(0);
  const lastCenter = useRef({ x: 0, y: 0 });
  const isPinching = useRef(false);

  const getDistance = (t1: { clientX: number; clientY: number }, t2: { clientX: number; clientY: number }) =>
    Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isPinching.current = true;
      lastDistance.current = getDistance(e.touches[0], e.touches[1]);
      lastCenter.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching.current) {
      e.preventDefault();
      const dist = getDistance(e.touches[0], e.touches[1]);
      const delta = dist / lastDistance.current;
      setScale((s) => Math.min(Math.max(s * delta, 1), 4));
      lastDistance.current = dist;

      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      setTranslate((t) => ({
        x: t.x + (cx - lastCenter.current.x),
        y: t.y + (cy - lastCenter.current.y),
      }));
      lastCenter.current = { x: cx, y: cy };
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    isPinching.current = false;
    if (scale <= 1.1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [scale]);

  // Reset on image change
  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={scale > 1.1 ? undefined : onClose}
    >
      <button className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
        <X className="w-7 h-7" />
      </button>
      <div className="absolute top-4 left-4 text-white/50 text-sm z-10">
        {selectedIndex + 1} / {images.length}
      </div>
      <div
        className="relative max-w-4xl max-h-[90vh] w-full h-full touch-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={() => {
          if (scale > 1.1) resetZoom();
          else { setScale(2); }
        }}
      >
        <Image
          src={image.url}
          alt={image.altText ?? productName}
          fill
          className="object-contain transition-transform duration-150"
          style={{ transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)` }}
        />
      </div>
      {images.length > 1 && scale <= 1.1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); resetZoom(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); resetZoom(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
