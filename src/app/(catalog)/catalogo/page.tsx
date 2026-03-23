import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/catalog/ProductCard";
import FilterSidebar from "@/components/catalog/FilterSidebar";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Catálogo" };
export const revalidate = 60;

interface Props {
  searchParams: Promise<{ categoria?: string; material?: string; search?: string; orden?: string }>;
}

async function getProducts(filters: Awaited<Props["searchParams"]>) {
  const where: Record<string, unknown> = { isActive: true };
  if (filters.categoria) where.category = { slug: filters.categoria };
  if (filters.search) where.name = { contains: filters.search, mode: "insensitive" };

  const orderBy = filters.orden === "precio_asc"
    ? undefined
    : filters.orden === "precio_desc"
    ? undefined
    : filters.orden === "nuevos"
    ? { createdAt: "desc" as const }
    : [{ isFeatured: "desc" as const }, { order: "asc" as const }];

  const products = await prisma.product.findMany({
    where,
    orderBy: orderBy as Parameters<typeof prisma.product.findMany>[0]["orderBy"],
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
      variants: { where: { isActive: true }, select: { price: true }, orderBy: { price: "asc" } },
    },
  });

  // Ordenar por precio en JS si hace falta
  if (filters.orden === "precio_asc") {
    products.sort((a, b) => {
      const pa = a.variants[0] ? Number(a.variants[0].price) : Infinity;
      const pb = b.variants[0] ? Number(b.variants[0].price) : Infinity;
      return pa - pb;
    });
  } else if (filters.orden === "precio_desc") {
    products.sort((a, b) => {
      const pa = a.variants[0] ? Number(a.variants[0].price) : 0;
      const pb = b.variants[0] ? Number(b.variants[0].price) : 0;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex gap-8">
        {/* Sidebar filtros */}
        <aside className="hidden lg:block w-56 shrink-0">
          <FilterSidebar
            categories={categories}
            materials={materials}
            active={filters}
          />
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className="text-xl font-bold text-[#1C1C1E]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {title}
              </h1>
              <p className="text-sm text-[#7A7A7A] mt-0.5">{products.length} productos</p>
            </div>
            {/* Ordenamiento */}
            <OrdenSelect current={filters.orden} />
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
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

function OrdenSelect({ current }: { current?: string }) {
  const options = [
    { value: "", label: "Destacados" },
    { value: "nuevos", label: "Más nuevos" },
    { value: "precio_asc", label: "Precio: menor a mayor" },
    { value: "precio_desc", label: "Precio: mayor a menor" },
  ];
  return (
    <form>
      <select
        name="orden"
        defaultValue={current ?? ""}
        onChange={(e) => {
          const url = new URL(window.location.href);
          if (e.target.value) url.searchParams.set("orden", e.target.value);
          else url.searchParams.delete("orden");
          window.location.href = url.toString();
        }}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-[#2C2C2C] bg-white outline-none focus:border-[#C9A96E] cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </form>
  );
}
