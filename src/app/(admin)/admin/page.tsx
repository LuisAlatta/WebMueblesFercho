import { prisma } from "@/lib/prisma";
import AdminTopBar from "@/components/admin/AdminTopBar";
import {
  Package,
  Tag,
  ImageOff,
  AlertTriangle,
  TrendingUp,
  Eye,
} from "lucide-react";
import Link from "next/link";

async function getDashboardData() {
  const [
    totalProducts,
    activeProducts,
    featuredProducts,
    totalCategories,
    productsWithoutImages,
    productsWithoutVariants,
    topProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.product.count({ where: { images: { none: {} } } }),
    prisma.product.count({ where: { variants: { none: {} } } }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { viewCount: "desc" },
      take: 5,
      select: { id: true, name: true, slug: true, viewCount: true },
    }),
  ]);

  return {
    totalProducts,
    activeProducts,
    featuredProducts,
    totalCategories,
    productsWithoutImages,
    productsWithoutVariants,
    topProducts,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();
  const alerts = data.productsWithoutImages + data.productsWithoutVariants;

  const stats = [
    {
      label: "Total productos",
      value: data.totalProducts,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/productos",
    },
    {
      label: "Productos activos",
      value: data.activeProducts,
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
      href: "/admin/productos",
    },
    {
      label: "Destacados",
      value: data.featuredProducts,
      icon: Eye,
      color: "bg-amber-50 text-amber-600",
      href: "/admin/productos",
    },
    {
      label: "Categorías activas",
      value: data.totalCategories,
      icon: Tag,
      color: "bg-purple-50 text-purple-600",
      href: "/admin/categorias",
    },
  ];

  return (
    <>
      <AdminTopBar title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Alertas */}
        {alerts > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 text-sm">
                {alerts} {alerts === 1 ? "alerta pendiente" : "alertas pendientes"}
              </p>
              <ul className="mt-1 space-y-0.5">
                {data.productsWithoutImages > 0 && (
                  <li className="text-amber-700 text-sm">
                    <Link href="/admin/productos" className="underline hover:no-underline">
                      {data.productsWithoutImages} producto{data.productsWithoutImages > 1 ? "s" : ""} sin imágenes
                    </Link>
                  </li>
                )}
                {data.productsWithoutVariants > 0 && (
                  <li className="text-amber-700 text-sm">
                    <Link href="/admin/productos" className="underline hover:no-underline">
                      {data.productsWithoutVariants} producto{data.productsWithoutVariants > 1 ? "s" : ""} sin variantes/precio
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-[#1C1C1E]">{stat.value}</p>
                <p className="text-sm text-[#7A7A7A] mt-0.5">{stat.label}</p>
              </Link>
            );
          })}
        </div>

        {/* Top productos + Alertas detalle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Más vistos */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-[#1C1C1E] mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#C9A96E]" />
              Productos más vistos
            </h2>
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-[#7A7A7A]">Aún no hay visitas registradas.</p>
            ) : (
              <ul className="space-y-3">
                {data.topProducts.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FAF9F7] border border-gray-200 flex items-center justify-center text-xs font-medium text-[#7A7A7A]">
                      {i + 1}
                    </span>
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="flex-1 text-sm text-[#2C2C2C] hover:text-[#C9A96E] transition-colors truncate"
                    >
                      {p.name}
                    </Link>
                    <span className="text-sm text-[#7A7A7A]">{p.viewCount} vis.</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Alertas detalle */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-[#1C1C1E] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C9A96E]" />
              Estado del catálogo
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data.productsWithoutImages === 0 ? "bg-green-50" : "bg-red-50"}`}>
                  <ImageOff className={`w-4 h-4 ${data.productsWithoutImages === 0 ? "text-green-500" : "text-red-500"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2C2C2C]">Sin imágenes</p>
                  <p className="text-xs text-[#7A7A7A]">
                    {data.productsWithoutImages === 0
                      ? "Todos los productos tienen imagen"
                      : `${data.productsWithoutImages} productos sin imagen`}
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${data.productsWithoutVariants === 0 ? "bg-green-50" : "bg-red-50"}`}>
                  <Package className={`w-4 h-4 ${data.productsWithoutVariants === 0 ? "text-green-500" : "text-red-500"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2C2C2C]">Sin precio/variantes</p>
                  <p className="text-xs text-[#7A7A7A]">
                    {data.productsWithoutVariants === 0
                      ? "Todos los productos tienen precio"
                      : `${data.productsWithoutVariants} productos sin precio`}
                  </p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Accesos rápidos */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-[#1C1C1E] mb-4">Accesos rápidos</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/productos/nuevo"
              className="text-sm bg-[#1C1C1E] text-white px-4 py-2 rounded-lg hover:bg-[#2C2C2E] transition-colors"
            >
              + Nuevo producto
            </Link>
            <Link
              href="/admin/categorias/nueva"
              className="text-sm bg-[#FAF9F7] text-[#1C1C1E] border border-gray-200 px-4 py-2 rounded-lg hover:border-[#C9A96E] transition-colors"
            >
              + Nueva categoría
            </Link>
            <Link
              href="/admin/configuracion"
              className="text-sm bg-[#FAF9F7] text-[#1C1C1E] border border-gray-200 px-4 py-2 rounded-lg hover:border-[#C9A96E] transition-colors"
            >
              Configuración del sitio
            </Link>
          </div>
        </div>

      </main>
    </>
  );
}
