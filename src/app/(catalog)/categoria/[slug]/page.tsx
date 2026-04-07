import { cache } from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/catalog/ProductCard";
import Breadcrumbs from "@/components/catalog/Breadcrumbs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 3600;

const getCategory = cache((slug: string) =>
  prisma.category.findUnique({ where: { slug, isActive: true } })
);

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategory(slug);
  return { title: cat?.name ?? "Categoria" };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategory(slug);
  if (!category) notFound();

  const raw = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      isFeatured: true,
      category: { select: { name: true, slug: true } },
      images: { orderBy: { order: "asc" }, take: 1, select: { url: true, altText: true } },
      variants: { where: { isActive: true }, select: { price: true }, orderBy: { price: "asc" } },
    },
  });
  const products = raw.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({ price: Number(v.price) })),
  }));

  return (
    <div className="min-h-[calc(100dvh-72px)]">
      {/* Header */}
      <div className="sticky top-[72px] z-40 bg-white border-b border-gray-100 px-4 py-3 md:bg-white/95 md:backdrop-blur-md">
        <Breadcrumbs items={[{ label: category.name }]} />
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <h1
              className="text-base font-bold text-[#1C1C1E] truncate"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {category.name}
            </h1>
            <p className="text-xs text-[#999]">
              {products.length}{" "}
              {products.length === 1 ? "producto" : "productos"}
            </p>
          </div>
        </div>
      </div>

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1px] bg-gray-100">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#f5f3f0] flex items-center justify-center mb-4">
            <span className="text-2xl">🪑</span>
          </div>
          <p className="text-[#999] text-sm">
            Todavia no hay productos en esta categoria.
          </p>
          <Link
            href="/"
            className="mt-4 text-sm text-[#C9A96E] font-medium hover:underline"
          >
            Volver al inicio
          </Link>
        </div>
      )}
    </div>
  );
}
