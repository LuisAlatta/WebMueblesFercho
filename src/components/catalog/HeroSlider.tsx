"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  title: string;
  subtitle: string;
  label: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  href: string;
  bg?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    label: "Estilo Moderno",
    title: "Muebles de\nDiseño Exclusivo",
    subtitle: "Fabricamos a medida con madera maciza, MDF y melamina de primera calidad.",
    href: "/catalogo",
    imageUrl: "/images/hero-diseno-exclusivo.png",
    mobileImageUrl: "/images/hero-diseno-exclusivo-mobile.png",
  },
  {
    label: "Estilo Rústico",
    title: "Calidad\nArtesanal",
    subtitle: "Cada mueble es único, creado con dedicación y los mejores materiales.",
    href: "/catalogo",
    imageUrl: "/images/hero-calidad-artesanal.png",
    mobileImageUrl: "/images/hero-calidad-artesanal-mobile.png",
  },
  {
    label: "Estilo Minimalista",
    title: "Tu espacio,\nTu estilo",
    subtitle: "Diseños personalizados que se adaptan perfectamente a tu hogar.",
    href: "/galeria",
    imageUrl: "/images/hero-tu-espacio.png",
    mobileImageUrl: "/images/hero-tu-espacio-mobile.png",
  },
];

export default function HeroSlider({ slides }: { slides?: HeroSlide[] }) {
  const list = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [current, setCurrent] = useState(0);
  const [entering, setEntering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (lockRef.current) return;
      lockRef.current = true;
      setEntering(true);          // hide new content instantly
      setCurrent(index);          // switch slide
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEntering(false);     // fade-in the new content
          setTimeout(() => { lockRef.current = false; }, 700);
        });
      });
    },
    []
  );

  const next = useCallback(() => goTo((current + 1) % list.length), [current, list.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + list.length) % list.length), [current, list.length, goTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5500);
  }, [next]);

  useEffect(() => {
    timerRef.current = setInterval(next, 5500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const slide = list[current];
  const currentImage = isMobile && slide.mobileImageUrl ? slide.mobileImageUrl : slide.imageUrl;

  return (
    /* h-[100dvh] usa el "dynamic viewport height" que excluye la barra del navegador en mobile */
    <div className="relative w-full min-h-[560px] h-[100dvh] overflow-hidden select-none">
      {/* Background */}
      {currentImage ? (
        <Image
          key={currentImage}
          src={currentImage}
          alt={slide.title}
          fill
          className={`object-cover transition-opacity duration-700 ${entering ? "opacity-80" : "opacity-100"}`}
          priority
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg ?? "from-[#1a1a1a] to-[#2a2a2a]"}`} />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content — centrado verticalmente con padding generoso en mobile */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-6 md:px-12">
        <p
          className={`text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A96E] mb-4 transition-all duration-700 ${
            entering ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
          }`}
        >
          {slide.label}
        </p>

        <h1
          className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5 max-w-3xl transition-all duration-700 delay-75 ${
            entering ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
          style={{ fontFamily: "var(--font-playfair)", whiteSpace: "pre-line" }}
        >
          {slide.title}
        </h1>

        <p
          className={`text-white/60 text-sm sm:text-base md:text-lg max-w-sm sm:max-w-lg mb-8 leading-relaxed transition-all duration-700 delay-100 ${
            entering ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          {slide.subtitle}
        </p>

        {/* Botón táctil grande en mobile */}
        <Link
          href={slide.href}
          className={`border border-white/80 hover:bg-white hover:text-[#1C1C1E] active:bg-white active:text-[#1C1C1E] text-white text-xs uppercase tracking-[0.2em] px-8 py-4 min-h-[52px] flex items-center transition-all duration-300 delay-150 ${
            entering ? "opacity-0" : "opacity-100"
          }`}
        >
          Ver más
        </Link>
      </div>

      {/* Flechas — ocultas en pantallas muy pequeñas, visibles desde sm */}
      <button
        onClick={() => { prev(); resetTimer(); }}
        aria-label="Anterior"
        className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 hover:border-white/80 hover:bg-white/10 items-center justify-center text-white transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => { next(); resetTimer(); }}
        aria-label="Siguiente"
        className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/30 hover:border-white/80 hover:bg-white/10 items-center justify-center text-white transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots — más grandes para facilitar el toque en mobile */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {list.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); resetTimer(); }}
            aria-label={`Slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-8 h-2 bg-[#C9A96E]"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70 active:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Contador (solo desktop) */}
      <div className="absolute bottom-8 right-8 z-20 text-white/40 text-xs tracking-widest hidden md:block">
        {String(current + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
      </div>
    </div>
  );
}
