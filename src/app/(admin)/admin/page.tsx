import { prisma } from "@/lib/prisma";
import AdminTopBar from "@/components/admin/AdminTopBar";
import {
  Package,
  Tag,
  ImageOff,
  AlertTriangle,
  TrendingUp,
  Eye,
  Plus,
  Settings,
  UploadCloud,
  Images,
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
    totalGallery,
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
    prisma.galleryPhoto.count(),
  ]);

  return {
    totalProducts,
    activeProducts,
    featuredProducts,
    totalCategories,
    productsWithoutImages,
    productsWithoutVariants,
    topProducts,
    totalGallery,
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
      color: "bg-blue-500/10 text-blue-600",
      iconBg: "bg-blue-500",
      href: "/admin/productos",
    },
    {
      label: "Productos activos",
      value: data.activeProducts,
      icon: TrendingUp,
      color: "bg-emerald-500/10 text-emerald-600",
      iconBg: "bg-emerald-500",
      href: "/admin/productos",
      subtext: data.totalProducts > 0
        ? `${Math.round((data.activeProducts / data.totalProducts) * 100)}% del total`
        : undefined,
    },
    {
      label: "Destacados",
      value: data.featuredProducts,
      icon: Eye,
      color: "bg-amber-500/10 text-amber-600",
      iconBg: "bg-amber-500",
      href: "/admin/productos",
    },
    {
      label: "Categorías activas",
      value: data.totalCategories,
      icon: Tag,
      color: "bg-purple-500/10 text-purple-600",
      iconBg: "bg-purple-500",
      href: "/admin/categorias",
    },
  ];

  const quickActions = [
    { label: "Nuevo producto", href: "/admin/productos/nuevo", icon: Plus, primary: true },
    { label: "Nueva categoría", href: "/admin/categorias/nueva", icon: Tag, primary: false },
    { label: "Carga masiva", href: "/admin/carga-masiva", icon: UploadCloud, primary: false },
    { label: "Galería", href: "/admin/galeria", icon: Images, primary: false },
    { label: "Configuración", href: "/admin/configuracion", icon: Settings, primary: false },
  ];

  return (
    <>
      <AdminTopBar title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

        {/* Alertas */}
        {alerts > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-amber-800 text-sm">
                {alerts} {alerts === 1 ? "alerta pendiente" : "alertas pendientes"}
              </p>
              <ul className="mt-1 space-y-0.5">
                {data.productsWithoutImages > 0 && (
                  <li className="text-amber-700 text-sm">
                    <Link href="/admin/productos" className="underline underline-offset-2 hover:no-underline">
                      {data.productsWithoutImages} producto{data.productsWithoutImages > 1 ? "s" : ""} sin imágenes
                    </Link>
                  </li>
                )}
                {data.productsWithoutVariants > 0 && (
                  <li className="text-amber-700 text-sm">
                    <Link href="/admin/productos" className="underline underline-offset-2 hover:no-underline">
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
                className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-gray-100/50 hover:border-gray-200 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-[#1C1C1E] tracking-tight">{stat.value}</p>
                <p className="text-sm text-[#7A7A7A] mt-0.5">{stat.label}</p>
                {stat.subtext && (
                  <p className="text-xs text-[#7A7A7A]/70 mt-1">{stat.subtext}</p>
                )}
              </Link>
            );
          })}
        </div>

        {/* Top productos + Estado del catálogo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Más vistos */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-[#1C1C1E] mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5 text-[#C9A96E]" />
              </div>
              Productos más vistos
            </h2>
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-[#7A7A7A] py-4 text-center">Aún no hay visitas registradas.</p>
            ) : (
              <ul className="space-y-2">
                {data.topProducts.map((p, i) => (
                  <li key={p.id}>
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-[#FAF9F7] transition-colors group"
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        i === 0 ? "bg-[#C9A96E]/15 text-[#C9A96E]" :
                        i === 1 ? "bg-gray-100 text-[#7A7A7A]" :
                        "bg-gray-50 text-[#7A7A7A]/60"
                      }`}>
                        {i + 1}
                      </span>
                      <span className="flex-1 text-sm text-[#2C2C2C] group-hover:text-[#C9A96E] transition-colors truncate">
                        {p.name}
                      </span>
                      <span className="text-xs text-[#7A7A7A] tabular-nums">{p.viewCount} vis.</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Estado del catálogo */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-[#1C1C1E] mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-[#C9A96E]" />
              </div>
              Estado del catálogo
            </h2>
            <div className="space-y-4">
              {/* Sin imágenes */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  data.productsWithoutImages === 0 ? "bg-emerald-50" : "bg-red-50"
                }`}>
                  <ImageOff className={`w-4 h-4 ${data.productsWithoutImages === 0 ? "text-emerald-500" : "text-red-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C2C2C]">Imágenes</p>
                  <p className="text-xs text-[#7A7A7A]">
                    {data.productsWithoutImages === 0
                      ? "Todos los productos tienen imagen"
                      : `${data.productsWithoutImages} sin imagen`}
                  </p>
                </div>
                {data.totalProducts > 0 && (
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${data.productsWithoutImages === 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {Math.round(((data.totalProducts - data.productsWithoutImages) / data.totalProducts) * 100)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Barra de progreso - imágenes */}
              {data.totalProducts > 0 && (
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden -mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      data.productsWithoutImages === 0 ? "bg-emerald-500" : "bg-red-400"
                    }`}
                    style={{
                      width: `${((data.totalProducts - data.productsWithoutImages) / data.totalProducts) * 100}%`,
                    }}
                  />
                </div>
              )}

              {/* Sin variantes */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  data.productsWithoutVariants === 0 ? "bg-emerald-50" : "bg-red-50"
                }`}>
                  <Package className={`w-4 h-4 ${data.productsWithoutVariants === 0 ? "text-emerald-500" : "text-red-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C2C2C]">Precios/variantes</p>
                  <p className="text-xs text-[#7A7A7A]">
                    {data.productsWithoutVariants === 0
                      ? "Todos los productos tienen precio"
                      : `${data.productsWithoutVariants} sin precio`}
                  </p>
                </div>
                {data.totalProducts > 0 && (
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${data.productsWithoutVariants === 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {Math.round(((data.totalProducts - data.productsWithoutVariants) / data.totalProducts) * 100)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Barra de progreso - variantes */}
              {data.totalProducts > 0 && (
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden -mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      data.productsWithoutVariants === 0 ? "bg-emerald-500" : "bg-red-400"
                    }`}
                    style={{
                      width: `${((data.totalProducts - data.productsWithoutVariants) / data.totalProducts) * 100}%`,
                    }}
                  />
                </div>
              )}

              {/* Galería */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-blue-50">
                  <Images className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C2C2C]">Galería</p>
                  <p className="text-xs text-[#7A7A7A]">{data.totalGallery} foto{data.totalGallery !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-[#1C1C1E] mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 text-center ${
                    action.primary
                      ? "bg-[#1C1C1E] border-[#1C1C1E] text-white hover:bg-[#2C2C2E]"
                      : "bg-white border-gray-100 text-[#1C1C1E] hover:border-[#C9A96E] hover:shadow-sm"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                    action.primary
                      ? "bg-white/10"
                      : "bg-[#FAF9F7]"
                  }`}>
                    <ActionIcon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
