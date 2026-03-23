import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Galería de trabajos" };
export const revalidate = 60;

export default async function GaleriaPage() {
  const photos = await prisma.galleryPhoto.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

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
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid rounded-xl overflow-hidden bg-gray-100 group relative">
              <Image
                src={photo.url}
                alt={photo.title ?? "Trabajo terminado"}
                width={400}
                height={300}
                className="w-full h-auto object-cover"
              />
              {photo.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">{photo.title}</p>
                  {photo.description && <p className="text-white/70 text-xs">{photo.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-[#7A7A7A]">
          <p>Próximamente fotos de nuestros trabajos.</p>
        </div>
      )}
    </div>
  );
}
