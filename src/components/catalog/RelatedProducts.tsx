import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";

export default async function RelatedProducts({ categoryId, excludeId }: { categoryId: number; excludeId: number }) {
  const rawRelated = await prisma.product.findMany({
    where: { categoryId, isActive: true, NOT: { id: excludeId } },
    take: 4,
    select: {
      id: true,
      name: true,
      slug: true,
      category: { select: { name: true, slug: true } },
      images: { orderBy: { order: "asc" }, take: 1, select: { url: true, altText: true } },
      variants: { where: { isActive: true }, select: { price: true }, orderBy: { price: "asc" } },
    },
  });

  const related = rawRelated.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({ price: Number(v.price) })),
  }));

  if (related.length === 0) return null;

  return (
    <section>
      <h2
        className="text-xl font-bold text-[#1C1C1E] mb-6"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        También te puede interesar
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((p) => <ProductCard key={p.id} {...p} />)}
      </div>
    </section>
  );
}
