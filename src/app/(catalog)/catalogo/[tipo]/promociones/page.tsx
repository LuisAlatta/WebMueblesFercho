import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import CatalogTypeSync from "@/components/catalog/CatalogTypeSync";
import { CatalogType } from "@/lib/catalogType";
import PromoGrid from "@/components/catalog/PromoGrid";

export const revalidate = 60;

interface Props {
  params: Promise<{ tipo: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo } = await params;
  return { title: tipo === "max" ? "Promociones — Mayorista" : "Promociones" };
}

export default async function PromocionesPage({ params }: Props) {
  const { tipo } = await params;
  if (tipo !== "min" && tipo !== "max") redirect("/catalogo/min/promociones");

  const [promoProducts, sets] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        isFeatured: true,
        retailPrice: true,
        wholesalePrice: true,
        category: { select: { name: true, slug: true } },
        images: { orderBy: { order: "asc" }, take: 1, select: { url: true, altText: true } },
      },
    }),
    prisma.productSet.findMany({
      where: { isActive: true },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                retailPrice: true,
                wholesalePrice: true,
                images: { orderBy: { order: "asc" }, take: 1, select: { url: true, altText: true } },
              },
            },
          },
        },
      },
      orderBy: { id: "asc" },
    }),
  ]);

  // Serializar Decimals
  const products = promoProducts.map((p) => ({
    ...p,
    retailPrice: p.retailPrice ? Number(p.retailPrice) : null,
    wholesalePrice: p.wholesalePrice ? Number(p.wholesalePrice) : null,
  }));

  const serializedSets = sets.map((s) => ({
    ...s,
    items: s.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        retailPrice: item.product.retailPrice ? Number(item.product.retailPrice) : null,
        wholesalePrice: item.product.wholesalePrice ? Number(item.product.wholesalePrice) : null,
      },
    })),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      <CatalogTypeSync tipo={tipo as CatalogType} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#1C1C1E]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Promociones
          </h1>
          <span className="bg-[#C9A96E] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            Especial
          </span>
        </div>
        {tipo === "max" && (
          <span className="inline-block mt-1 text-xs font-semibold uppercase tracking-widest text-white bg-[#1C1C1E] px-3 py-1 rounded-full">
            Mayorista
          </span>
        )}
      </div>

      <PromoGrid products={products} sets={serializedSets} tipo={tipo as CatalogType} />
    </div>
  );
}
