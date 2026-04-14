"use client";

import Link from "next/link";
import Image from "next/image";
import { CatalogType } from "@/lib/catalogType";

// Fallback images por slug de categoría (imágenes locales)
const LOCAL_IMAGES: Record<string, string> = {
  dormitorios: "/images/cat-dormitorios.png",
  living: "/images/cat-living.png",
  comedor: "/images/cat-comedor.png",
  cocina: "/images/cat-cocina.png",
  banos: "/images/cat-banos.png",
  oficina: "/images/cat-oficina.png",
};

interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  _count: { products: number };
}

interface CategoryGridProps {
  categories: Category[];
  tipo: CatalogType;
}

export default function CategoryGrid({ categories, tipo }: CategoryGridProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#7A7A7A]">No hay categorías disponibles aún.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      <Link
        href={`/catalogo/${tipo}/promociones`}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] hover:from-[#2C2C2E] hover:to-[#3C3C3E] transition-all duration-500 aspect-[4/5] block shadow-md border border-[#C9A96E]/20"
      >
        {/* Decorative elements for premium feel */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A96E]/10 rounded-bl-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#C9A96E]/5 rounded-tr-full blur-3xl group-hover:bg-[#C9A96E]/10 transition-colors duration-500" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />

        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end z-10">
          <h2
            className="text-white font-bold text-lg sm:text-2xl leading-tight mb-1 group-hover:text-[#C9A96E] transition-colors duration-300 drop-shadow-md"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Promociones
          </h2>
          <p className="text-[#C9A96E]/80 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em]">
            Sets y Especiales
          </p>
        </div>
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
          <span className="bg-red-500 shadow-lg text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Ofertas
          </span>
        </div>
      </Link>

      {categories.map((cat) => {
        const imgSrc = cat.imageUrl || LOCAL_IMAGES[cat.slug] || null;
        return (
          <Link
            key={cat.id}
            href={`/catalogo/${tipo}?categoria=${cat.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-[#f0ece6] aspect-[4/5] block"
          >
            {/* Imagen */}
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-[#ddd8d0]" />
            )}

            {/* Overlay gradiente siempre visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Overlay extra en hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

            {/* Texto */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <h2
                className="text-white font-bold text-lg sm:text-xl leading-tight mb-1 group-hover:text-[#C9A96E] transition-colors duration-300"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {cat.name}
              </h2>
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest">
                {cat._count.products} {cat._count.products === 1 ? "producto" : "productos"}
              </p>
            </div>

            {/* Badge "Ver" en hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-white/90 text-[#1C1C1E] text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                Ver
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
