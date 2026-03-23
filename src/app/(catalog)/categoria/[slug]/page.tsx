import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/catalog/ProductCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  return { title: cat?.name ?? "Categoría" };
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
  });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
      variants: { where: { isActive: true }, select: { price: true }, orderBy: { price: "asc" } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/catalogo" className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#1C1C1E] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al catálogo
      </Link>

      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold text-[#1C1C1E]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {category.name}
        </h1>
        {category.description && (
          <p className="text-[#7A7A7A] mt-2">{category.description}</p>
        )}
        <p className="text-sm text-[#7A7A7A] mt-1">{products.length} productos</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-[#7A7A7A]">No hay productos en esta categoría todavía.</p>
        </div>
      )}
    </div>
  );
}
