import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
  name, slug, category, images, variants, isFeatured,
}: ProductCardProps) {
  const img = images[0];
  const prices = variants.map((v) => Number(v.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
  const samePrice = minPrice === maxPrice;

  return (
    <Link href={`/producto/${slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
        {/* Imagen */}
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
          {img ? (
            <Image
              src={img.url}
              alt={img.altText ?? name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {isFeatured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-[#C9A96E] text-[#1C1C1E] text-xs font-medium hover:bg-[#C9A96E]">
                Destacado
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-[#8B7355] font-medium uppercase tracking-wide mb-1">
            {category.name}
          </p>
          <h3 className="text-[#1C1C1E] font-medium text-sm leading-snug group-hover:text-[#8B7355] transition-colors line-clamp-2">
            {name}
          </h3>
          <div className="mt-2">
            {minPrice !== null ? (
              <p className="text-[#1C1C1E] font-semibold text-sm">
                {samePrice
                  ? formatPrice(minPrice)
                  : `Desde ${formatPrice(minPrice)}`}
              </p>
            ) : (
              <p className="text-[#7A7A7A] text-sm">Consultar precio</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
