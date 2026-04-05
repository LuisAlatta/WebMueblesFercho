import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import HomeSearch from "@/components/catalog/HomeSearch";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

const categoryImages: Record<string, string> = {
  dormitorio: "/images/cat-dormitorios.png",
  living: "/images/cat-living.png",
  comedor: "/images/cat-comedor.png",
  cocina: "/images/cat-cocina.png",
  oficina: "/images/cat-oficina.png",
  "baño": "/images/cat-banos.png",
};

function getCategoryImage(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [key, src] of Object.entries(categoryImages)) {
    if (lower.includes(key)) return src;
  }
  return null;
}

export default async function HomePage() {
  const [categories, totalProducts] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="flex flex-col min-h-[calc(100dvh-72px)]">
      {/* Search bar - sticky below navbar */}
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <HomeSearch />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-5 pb-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-4">
          <h1
            className="text-lg font-bold text-[#1C1C1E]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Categorias
          </h1>
          <Link
            href="/catalogo"
            className="flex items-center gap-1 text-xs text-[#C9A96E] font-medium hover:text-[#b8965e] transition-colors"
          >
            Ver todo ({totalProducts})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const img = cat.imageUrl || getCategoryImage(cat.name);

            return (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
              >
                {img ? (
                  <Image
                    src={img}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#e8e4df] to-[#d4cfc8]" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h2
                    className="text-white font-bold text-base sm:text-lg leading-tight drop-shadow-lg"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {cat.name}
                  </h2>
                  <p className="text-white/70 text-xs mt-0.5">
                    {cat._count.products}{" "}
                    {cat._count.products === 1 ? "producto" : "productos"}
                  </p>
                </div>

                {/* Gold accent on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A96E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
