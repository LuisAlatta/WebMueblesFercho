"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCatalogType } from "@/components/catalog/CatalogTypeProvider";
import { Package, ArrowRight } from "lucide-react";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNjciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjY3IiBmaWxsPSIjZjBlY2U2Ii8+PC9zdmc+";

interface Product {
  id: number;
  name: string;
  slug: string;
  retailPrice: number | null;
  wholesalePrice: number | null;
  category: { name: string; slug: string };
  images: { url: string; altText?: string | null }[];
  isFeatured?: boolean;
}

interface SetItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    retailPrice: number | null;
    wholesalePrice: number | null;
    images: { url: string; altText?: string | null }[];
  };
}

interface ProductSet {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  items: SetItem[];
}

interface PromoGridProps {
  products: Product[];
  sets: ProductSet[];
  tipo: "min" | "max";
}

export default function PromoGrid({ products, sets }: PromoGridProps) {
  const { catalogType } = useCatalogType();

  const hasProducts = products.length > 0;
  const hasSets = sets.length > 0;

  if (!hasProducts && !hasSets) {
    return (
      <div className="text-center py-20">
        <p className="text-[#7A7A7A] text-sm">No hay promociones activas en este momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Productos en promoción */}
      {hasProducts && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <h2
              className="text-xl font-bold text-[#1C1C1E]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Productos en oferta
            </h2>
            <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
              {products.length}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {products.map((p) => {
              const img = p.images[0];
              const price = catalogType === "max" ? p.wholesalePrice : p.retailPrice;

              return (
                <Link
                  key={p.id}
                  href={`/producto/${p.slug}?tipo=${catalogType}`}
                  className="group block overflow-hidden bg-[#f0ece6] active:scale-[0.97] transition-transform duration-150"
                >
                  <div className="relative aspect-[3/5] overflow-hidden">
                    {img ? (
                      <Image
                        src={img.url}
                        alt={img.altText ?? p.name}
                        fill
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#ddd8d0]" />
                    )}
                    {/* Promo badge */}
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      Oferta
                    </span>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-500 hidden md:flex flex-col items-center justify-end pointer-events-none group-hover:pointer-events-auto">
                      <div className="w-full p-5 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-center">
                        <p className="text-[10px] text-[#C9A96E] uppercase tracking-[0.25em] mb-1">{p.category.name}</p>
                        <p className="text-white font-semibold text-sm leading-tight mb-3 line-clamp-2" style={{ fontFamily: "var(--font-playfair)" }}>
                          {p.name}
                        </p>
                        <span className="inline-block border border-white/70 text-white text-[9px] uppercase tracking-widest px-5 py-2">
                          Ver producto
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-4 bg-white border-b border-gray-100 text-center">
                    <p className="text-[10px] text-[#C9A96E] font-semibold uppercase tracking-widest mb-1 truncate">
                      {p.category.name}
                    </p>
                    <h3 className="text-[#1C1C1E] text-xs sm:text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#8B7355] transition-colors">
                      {p.name}
                    </h3>
                    {price !== null && (
                      <p className="text-[#C9A96E] font-bold text-sm mt-1">{formatPrice(price)}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Sets de muebles */}
      {hasSets && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <h2
              className="text-xl font-bold text-[#1C1C1E]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Combos de muebles
            </h2>
            <span className="text-xs bg-[#1C1C1E] text-white font-bold px-2 py-0.5 rounded-full">
              {sets.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sets.map((s) => {
              const coverImg = s.imageUrl || s.items[0]?.product.images[0]?.url || null;

              // Calcular precio total del combo
              const totalRetail = s.items.reduce((acc, item) => {
                return acc + (item.product.retailPrice ?? 0) * item.quantity;
              }, 0);
              const totalWholesale = s.items.reduce((acc, item) => {
                return acc + (item.product.wholesalePrice ?? 0) * item.quantity;
              }, 0);
              const totalPrice = catalogType === "max" ? totalWholesale : totalRetail;

              return (
                <div
                  key={s.id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Cover image o collage */}
                  <div className="relative aspect-video bg-[#f0ece6] overflow-hidden">
                    {coverImg ? (
                      <Image
                        src={coverImg}
                        alt={s.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-[#C9A96E]/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-[#C9A96E] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                        Combo completo
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3
                      className="text-lg font-bold text-[#1C1C1E] mb-1"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {s.name}
                    </h3>
                    {s.description && (
                      <p className="text-xs text-[#7A7A7A] mb-3 line-clamp-2">{s.description}</p>
                    )}

                    {/* Productos del combo */}
                    <div className="space-y-1 mb-4">
                      {s.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 text-xs text-[#2C2C2C]">
                          <span className="w-4 h-4 rounded-full bg-[#f0ece6] flex items-center justify-center text-[9px] font-bold text-[#C9A96E] shrink-0">
                            {item.quantity}
                          </span>
                          <span className="truncate">{item.product.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-[10px] text-[#7A7A7A] uppercase tracking-wider">Precio conjunto</p>
                        {totalPrice > 0 ? (
                          <p className="text-xl font-bold text-[#C9A96E]">{formatPrice(totalPrice)}</p>
                        ) : (
                          <p className="text-sm text-[#7A7A7A]">Consultar precio</p>
                        )}
                      </div>
                      <a
                        href={`https://wa.me/51${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}?text=${encodeURIComponent(`Hola! Me interesa el combo "${s.name}". ¿Pueden darme más información?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
                      >
                        Consultar
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
