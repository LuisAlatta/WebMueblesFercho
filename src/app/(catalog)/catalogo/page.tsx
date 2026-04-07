import dynamic from "next/dynamic";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/catalog/ProductGrid";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import ActiveFilters from "@/components/catalog/ActiveFilters";
import OrdenSelect from "@/components/catalog/OrdenSelect";
import { toSearchQuery } from "@/lib/utils";
import { Metadata } from "next";

const MobileFilterDrawer = dynamic(() => import("@/components/catalog/MobileFilterDrawer"));

export const metadata: Metadata = { title: "Catálogo" };
export const revalidate = 60;

interface Props {
  searchParams: Promise<{ categoria?: string; material?: string; search?: string; orden?: string }>;
}

async function getProducts(filters: Awaited<Props["searchParams"]>) {
  const where: Record<string, unknown> = { isActive: true };
  if (filters.categoria) where.category = { slug: filters.categoria };
  if (filters.search) {
    const tsquery = toSearchQuery(filters.search);
    where.name = tsquery
      ? { search: tsquery }
      : { contains: filters.search, mode: "insensitive" };
  }
  if (filters.material) where.variants = { some: { isActive: true, material: { name: filters.material } } };

  const byPrice = filters.orden === "precio_asc" || filters.orden === "precio_desc";
  const orderBy = byPrice
    ? undefined
    : filters.orden === "nuevos"
    ? ({ createdAt: "desc" } as const)
    : [{ isFeatured: "desc" as const }, { order: "asc" as const }];

  const raw = await prisma.product.findMany({
    where,
    ...(orderBy ? { orderBy } : {}),
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

  if (filters.orden === "precio_asc") {
    products.sort((a, b) => {
      const pa = a.variants[0]?.price ?? Infinity;
      const pb = b.variants[0]?.price ?? Infinity;
      return pa - pb;
    });
  } else if (filters.orden === "precio_desc") {
    products.sort((a, b) => {
      const pa = a.variants[0]?.price ?? 0;
      const pb = b.variants[0]?.price ?? 0;
      return pb - pa;
    });
  }

  return products;
}

export default async function CatalogoPage({ searchParams }: Props) {
  const filters = await searchParams;
  const [products, categories, materials] = await Promise.all([
    getProducts(filters),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.material.findMany({ orderBy: { name: "asc" } }),
  ]);

  const title = filters.search
    ? `Resultados para "${filters.search}"`
    : filters.categoria
    ? categories.find((c) => c.slug === filters.categoria)?.name ?? "Catálogo"
    : "Catálogo completo";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      <div className="flex gap-8">
        {/* Sidebar filtros — solo desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <FilterSidebar categories={categories} materials={materials} active={filters} />
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          {/* Header del catálogo */}
          <div className="flex items-center justify-between mb-5 gap-3">
            <div className="min-w-0">
              <h1
                className="text-lg sm:text-xl font-bold text-[#1C1C1E] truncate"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-[#7A7A7A] mt-0.5">{products.length} productos</p>
            </div>

            {/* Controles filtros + orden */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Botón filtros mobile */}
              <MobileFilterDrawer categories={categories} materials={materials} active={filters} />
              {/* Ordenamiento */}
              <OrdenSelect current={filters.orden} />
            </div>
          </div>

          {/* Active filter chips */}
          <ActiveFilters
            filters={filters}
            categoryName={categories.find((c) => c.slug === filters.categoria)?.name}
          />

          {/* Grid de productos */}
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20">
              <p className="text-[#7A7A7A]">No se encontraron productos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
