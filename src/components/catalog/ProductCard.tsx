import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  category: { name: string; slug: string };
  images: { url: string; altText?: string | null }[];
  variants: { price: number | string }[];
  isFeatured?: boolean;
}

export default function ProductCard({
  name, slug, category, images, variants,
}: ProductCardProps) {
  const img = images[0];
  const prices = variants.map((v) => Number(v.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
  const samePrice = minPrice === maxPrice;

  return (
    <Link href={`/producto/${slug}`} className="group block overflow-hidden bg-[#f0ece6]">
      {/* Imagen */}
      <div className="relative aspect-[3/5] overflow-hidden">
        {img ? (
          <Image
            src={img.url}
            alt={img.altText ?? name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#ddd8d0]">
            <svg className="w-10 h-10 text-[#bbb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Overlay en hover (solo desktop, en mobile no hay hover) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-500 hidden md:flex flex-col items-center justify-end pointer-events-none group-hover:pointer-events-auto">
          <div className="w-full p-5 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-center">
            <p className="text-[10px] text-[#C9A96E] uppercase tracking-[0.25em] mb-1">{category.name}</p>
            <p
              className="text-white font-semibold text-sm leading-tight mb-3 line-clamp-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {name}
            </p>
            <span className="inline-block border border-white/70 text-white text-[9px] uppercase tracking-widest px-5 py-2">
              Ver producto
            </span>
          </div>
        </div>
      </div>

      {/* Info debajo — siempre visible (especialmente importante en mobile) */}
      <div className="px-3 py-3 bg-white border-b border-gray-100">
        <p className="text-[10px] text-[#C9A96E] font-semibold uppercase tracking-widest mb-0.5 truncate">
          {category.name}
        </p>
        <h3 className="text-[#1C1C1E] text-xs sm:text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#8B7355] transition-colors mb-1.5">
          {name}
        </h3>
        {minPrice !== null ? (
          <p className="text-[#1C1C1E] font-bold text-sm">
            {samePrice ? formatPrice(minPrice) : `Desde ${formatPrice(minPrice)}`}
          </p>
        ) : (
          <p className="text-[#999] text-xs">Consultar precio</p>
        )}
      </div>
    </Link>
  );
}
