import { cache, Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { Metadata } from "next";
import ProductDetail from "@/components/catalog/ProductDetail";
import RelatedProducts from "@/components/catalog/RelatedProducts";
import { getSiteUrl } from "@/lib/siteUrl";

export const revalidate = 3600;

const getProduct = cache((slug: string) =>
  prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { order: "asc" } },
      variants: {
        where: { isActive: true },
        include: { material: true, measurement: true },
        orderBy: { price: "asc" },
      },
    },
  })
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ?? undefined,
    openGraph: product.images[0] ? { images: [product.images[0].url] } : undefined,
  };
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) notFound();

  // Incrementar contador de visitas fuera del request (no bloquea response)
  after(async () => {
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});
  });

  // Serializar Decimal → number en variantes
  const productSerialized = {
    ...product,
    variants: product.variants.map((v) => ({ ...v, price: Number(v.price) })),
  };

  const base = getSiteUrl();
  const minPrice = productSerialized.variants[0]?.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description?.replace(/<[^>]*>/g, "") ?? undefined,
    image: product.images.map((i) => i.url),
    url: `${base}/producto/${product.slug}`,
    brand: { "@type": "Brand", name: "Muebles Fercho" },
    category: product.category.name,
    ...(minPrice !== undefined && {
      offers: {
        "@type": "Offer",
        priceCurrency: "ARS",
        price: minPrice,
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "Muebles Fercho" },
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={productSerialized} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <Suspense fallback={
          <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/5] bg-[#f0ece6] rounded" />
                <div className="px-3 py-3"><div className="h-3 w-20 bg-[#f0ece6] rounded" /></div>
              </div>
            ))}
          </div>
        }>
          <RelatedProducts categoryId={product.categoryId} excludeId={product.id} />
        </Suspense>
      </div>
    </>
  );
}
