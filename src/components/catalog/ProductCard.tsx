import Link from "next/link";
import Image from "next/image";
import { useCatalogType } from "./CatalogTypeProvider";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNjciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjY3IiBmaWxsPSIjZjBlY2U2Ii8+PC9zdmc+";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  category: { name: string; slug: string };
  images: { url: string; altText?: string | null }[];
  isFeatured?: boolean;
}

export default function ProductCard({
  name, slug, category, images, isFeatured,
}: ProductCardProps) {
  const img = images[0];
  const { catalogType } = useCatalogType();

  return (
    <Link href={`/producto/${slug}?tipo=${catalogType}`} className="group block overflow-hidden bg-[#f0ece6] active:scale-[0.97] transition-transform duration-150">
      {/* Imagen */}
      <div className="relative aspect-[3/5] overflow-hidden">
        {img ? (
          <Image
            src={img.url}
            alt={img.altText ?? name}
            fill
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-[#ddd8d0] shimmer" />
        )}

        {/* Badges */}
        {isFeatured && (
          <span className="absolute top-2 left-2 bg-[#C9A96E] text-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Destacado
          </span>
        )}

        {/* Overlay en hover (solo desktop) */}
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

      {/* Info debajo */}
      <div className="px-3 py-4 bg-white border-b border-gray-100 text-center">
        <p className="text-[10px] text-[#C9A96E] font-semibold uppercase tracking-widest mb-1 mx-auto truncate text-center">
          {category.name}
        </p>
        <h3 className="text-[#1C1C1E] text-xs sm:text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#8B7355] transition-colors mx-auto text-center">
          {name}
        </h3>
      </div>
    </Link>
  );
}
