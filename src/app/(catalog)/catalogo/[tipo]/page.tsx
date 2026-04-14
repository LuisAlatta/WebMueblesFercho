import dynamic from "next/dynamic";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/catalog/ProductGrid";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import ActiveFilters from "@/components/catalog/ActiveFilters";
import OrdenSelect from "@/components/catalog/OrdenSelect";
import { toSearchQuery } from "@/lib/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import CatalogTypeSync from "@/components/catalog/CatalogTypeSync";
import { CatalogType } from "@/lib/catalogType";

const MobileFilterDrawer = dynamic(() => import("@/components/catalog/MobileFilterDrawer"));

export const metadata: Metadata = { title: "Catálogo" };
export const revalidate = 60;

interface Props {
  params: Promise<{ tipo: string }>;
  searchParams: Promise<{ categoria?: string; material?: string; search?: string; orden?: string }>;
}

async function getProducts(filters: Awaited<Props["searchParams"]>, tipo: CatalogType) {
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
  // The database fields for price sort
  const priceField = tipo === "min" ? "retailPrice" : "wholesalePrice";

  const orderBy = byPrice
    ? [{ [priceField]: filters.orden === "precio_asc" ? "asc" : "desc" } as const, { id: "asc" as const }]
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
    },
  });

  return raw;
}

export default async function CatalogoPage({ params, searchParams }: Props) {
  const { tipo } = await params;
  if (tipo !== "min" && tipo !== "max") {
    redirect("/catalogo/min");
  }

  const filters = await searchParams;
  const [products, categories, materials] = await Promise.all([
    getProducts(filters, tipo as CatalogType),
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
      <CatalogTypeSync tipo={tipo as CatalogType} />
      <div className="flex gap-8">
        {/* Sidebar filtros — solo desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <FilterSidebar categories={categories} materials={materials} active={filters} />
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          {/* Header del catálogo */}
          <div className="flex flex-col mb-6 gap-4">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-[#1C1C1E]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {title}
              </h1>
              <p className="text-sm text-[#7A7A7A] mt-1">{products.length} productos</p>
            </div>

            {/* Controles filtros + orden */}
            <div className="flex items-center gap-2 justify-end w-full border-t border-gray-100 pt-3 lg:border-none lg:pt-0 lg:justify-start">
              {/* Botón filtros mobile */}
              <div className="lg:hidden">
                <MobileFilterDrawer categories={categories} materials={materials} active={filters} />
              </div>
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
