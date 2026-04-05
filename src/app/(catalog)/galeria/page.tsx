import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Galeria" };
export const revalidate = 3600;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function GaleriaPage() {
  const productImages = await prisma.productImage.findMany({
    where: { product: { isActive: true } },
    include: {
      product: { select: { name: true, slug: true, category: { select: { name: true } } } },
    },
    orderBy: { order: "asc" },
  });

  const photos = shuffle(productImages);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1C1C1E]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Galería de trabajos
        </h1>
        <p className="text-[#7A7A7A] mt-3 max-w-xl mx-auto">
          Muebles fabricados y entregados en casas de nuestros clientes.
        </p>
      </div>

      {photos.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {photos.map((photo) => (
            <Link
              key={photo.id}
              href={`/producto/${photo.product.slug}`}
              className="break-inside-avoid rounded-xl overflow-hidden bg-gray-100 group relative block"
            >
              <Image
                src={photo.url}
                alt={photo.altText ?? photo.product.name}
                width={400}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium line-clamp-1">{photo.product.name}</p>
                <p className="text-white/60 text-xs">{photo.product.category.name}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-[#7A7A7A]">
          <p>Proximamente fotos de nuestros trabajos.</p>
        </div>
      )}
    </div>
  );
}
