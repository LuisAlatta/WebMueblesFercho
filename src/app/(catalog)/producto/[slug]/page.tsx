import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetail from "@/components/catalog/ProductDetail";
import { getSiteUrl } from "@/lib/siteUrl";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { take: 1, orderBy: { order: "asc" } } },
  });
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ?? undefined,
    openGraph: product.images[0] ? { images: [product.images[0].url] } : undefined,
  };
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
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
  });

  if (!product) notFound();

  // Incrementar contador de visitas (fire-and-forget)
  prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  // Serializar Decimal → number en variantes
  const productSerialized = {
    ...product,
    variants: product.variants.map((v) => ({ ...v, price: Number(v.price) })),
  };

  // Productos relacionados
  const rawRelated = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, NOT: { id: product.id } },
    take: 4,
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
      variants: { where: { isActive: true }, select: { price: true }, orderBy: { price: "asc" } },
    },
  });
  const related = rawRelated.map((p) => ({ ...p, variants: p.variants.map((v) => ({ price: Number(v.price) })) }));

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
      <ProductDetail product={productSerialized} related={related} />
    </>
  );
}
