import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetail from "@/components/catalog/ProductDetail";

export const revalidate = 60;

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

  // Productos relacionados
  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, NOT: { id: product.id } },
    take: 4,
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
      variants: { where: { isActive: true }, select: { price: true }, orderBy: { price: "asc" } },
    },
  });

  return <ProductDetail product={product} related={related} />;
}
