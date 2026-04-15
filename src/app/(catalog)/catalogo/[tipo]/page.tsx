import dynamic from "next/dynamic";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/catalog/ProductGrid";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import ActiveFilters from "@/components/catalog/ActiveFilters";
import OrdenSelect from "@/components/catalog/OrdenSelect";
import CategoryGrid from "@/components/catalog/CategoryGrid";
import StoreLocation from "@/components/catalog/StoreLocation";
import { getStoreLocation } from "@/lib/getStoreLocation";
import { toSearchQuery } from "@/lib/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import CatalogTypeSync from "@/components/catalog/CatalogTypeSync";
import { CatalogType } from "@/lib/catalogType";

const MobileFilterDrawer = dynamic(() => import("@/components/catalog/MobileFilterDrawer"));

export const revalidate = 60;

interface Props {
  params: Promise<{ tipo: string }>;
  searchParams: Promise<{ categoria?: string; material?: string; search?: string; orden?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { tipo } = await params;
  const { categoria } = await searchParams;
  if (categoria) {
    const cat = await prisma.category.findUnique({ where: { slug: categoria }, select: { name: true } });
    const label = tipo === "max" ? `${cat?.name ?? "Categoría"} — Mayorista` : (cat?.name ?? "Categoría");
    return { title: label };
  }
  return { title: tipo === "max" ? "Catálogo Mayorista" : "Catálogo" };
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
  const priceField = tipo === "min" ? "retailPrice" : "wholesalePrice";

  const orderBy = byPrice
    ? [{ [priceField]: filters.orden === "precio_asc" ? "asc" : "desc" } as const, { id: "asc" as const }]
    : filters.orden === "nuevos"
      ? ({ createdAt: "desc" } as const)
      : [{ isFeatured: "desc" as const }, { order: "asc" as const }];

  return prisma.product.findMany({
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
}

export default async function CatalogoPage({ params, searchParams }: Props) {
  const { tipo } = await params;
  if (tipo !== "min" && tipo !== "max") {
    redirect("/catalogo/min");
  }

  const filters = await searchParams;
  const showingProducts = !!(filters.categoria || filters.search || filters.material);

  const [categories, materials] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true, name: true, slug: true, imageUrl: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
    }),
    prisma.material.findMany({ orderBy: { name: "asc" } }),
  ]);

  const products = showingProducts ? await getProducts(filters, tipo as CatalogType) : [];
  const store = await getStoreLocation();

  const activeCategory = categories.find((c) => c.slug === filters.categoria);
  const baseTitle = filters.search
    ? `Resultados para "${filters.search}"`
    : activeCategory
    ? activeCategory.name
    : tipo === "max" ? "Catálogo Mayorista" : "Catálogo";

  const title = tipo === "max" && showingProducts ? `${baseTitle} — Mayorista` : baseTitle;

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
      <CatalogTypeSync tipo={tipo as CatalogType} />

      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl sm:text-3xl font-bold text-[#1C1C1E]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {title}
        </h1>
        {tipo === "max" && !showingProducts && (
          <span className="inline-block mt-1 text-xs font-semibold uppercase tracking-widest text-white bg-[#1C1C1E] px-3 py-1 rounded-full">
            Catálogo Mayorista
          </span>
        )}
      </div>

      {/* Vista de categorías (sin filtros activos) */}
      {!showingProducts ? (
        <CategoryGrid categories={categories} tipo={tipo as CatalogType} />
      ) : (
        /* Vista de productos (con filtro activo) */
        <div className="flex gap-8">
          {/* Sidebar — solo desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterSidebar categories={categories} materials={materials} active={filters} />
          </aside>

          <div className="flex-1 min-w-0">
            {/* Controles */}
            <div className="flex items-center gap-2 justify-end w-full border-b border-gray-100 pb-3 mb-4 lg:border-none lg:pb-0 lg:mb-0 lg:justify-start">
              <div className="lg:hidden">
                <MobileFilterDrawer categories={categories} materials={materials} active={filters} />
              </div>
              <OrdenSelect current={filters.orden} />
            </div>

            {/* Active filter chips */}
            <ActiveFilters
              filters={filters}
              categoryName={activeCategory?.name}
            />

            <p className="text-sm text-[#7A7A7A] mb-4">{products.length} productos</p>

            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-20">
                <p className="text-[#7A7A7A]">No se encontraron productos.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    <StoreLocation config={store.config} photos={store.photos} />
    </>
  );
}
