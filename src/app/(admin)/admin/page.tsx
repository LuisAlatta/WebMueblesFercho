import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Tag,
  AlertTriangle,
  TrendingUp,
  Eye,
  Plus,
  Settings,
  UploadCloud,
  Images,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";

// Force dynamic so page doesn't try to statically generate
export const dynamic = "force-dynamic";

/* ─── Data fetchers (each is its own async component) ─── */

async function StatsCards() {
  const [totalProducts, activeProducts, featuredProducts, totalCategories] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isFeatured: true } }),
      prisma.category.count({ where: { isActive: true } }),
    ]);

  const stats = [
    { label: "Total productos", value: totalProducts, icon: Package, gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/25", href: "/admin/productos" },
    { label: "Activos", value: activeProducts, icon: TrendingUp, gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/25", href: "/admin/productos", subtext: totalProducts > 0 ? `${Math.round((activeProducts / totalProducts) * 100)}%` : undefined },
    { label: "Destacados", value: featuredProducts, icon: Eye, gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/25", href: "/admin/productos" },
    { label: "Categorías", value: totalCategories, icon: Tag, gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/25", href: "/admin/categorias" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative overflow-hidden rounded-2xl p-5 bg-white border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} ${stat.shadow} shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-slate-800 tracking-tight">{stat.value}</p>
              {stat.subtext && <span className="text-xs font-medium text-emerald-500 mb-1">{stat.subtext}</span>}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wider">{stat.label}</p>
          </Link>
        );
      })}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl p-5 bg-white border border-slate-100">
          <Skeleton className="w-11 h-11 rounded-xl mb-4" />
          <Skeleton className="h-8 w-12 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

async function AlertsBanner() {
  const [productsWithoutImages, productsWithoutVariants] = await Promise.all([
    prisma.product.count({ where: { images: { none: {} } } }),
    prisma.product.count({ where: { variants: { none: {} } } }),
  ]);
  const alerts = productsWithoutImages + productsWithoutVariants;
  if (alerts === 0) return null;

  return (
    <div className="bg-amber-50/80 border border-amber-200/50 rounded-2xl p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
      </div>
      <div>
        <p className="font-semibold text-amber-800 text-sm">{alerts} alerta{alerts > 1 ? "s" : ""}</p>
        <ul className="mt-1 space-y-0.5">
          {productsWithoutImages > 0 && (
            <li className="text-amber-700 text-sm">
              <Link href="/admin/productos" className="underline underline-offset-2 decoration-amber-300 hover:decoration-amber-500">
                {productsWithoutImages} producto{productsWithoutImages > 1 ? "s" : ""} sin imágenes
              </Link>
            </li>
          )}
          {productsWithoutVariants > 0 && (
            <li className="text-amber-700 text-sm">
              <Link href="/admin/productos" className="underline underline-offset-2 decoration-amber-300 hover:decoration-amber-500">
                {productsWithoutVariants} producto{productsWithoutVariants > 1 ? "s" : ""} sin precio
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

async function TopProducts() {
  const topProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { viewCount: "desc" },
    take: 5,
    select: { id: true, name: true, viewCount: true },
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2.5 text-sm">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center">
          <Eye className="w-3.5 h-3.5 text-white" />
        </div>
        Productos más vistos
      </h2>
      {topProducts.length === 0 ? (
        <p className="text-sm text-slate-400 py-6 text-center">Aún no hay visitas registradas.</p>
      ) : (
        <ul className="space-y-1">
          {topProducts.map((p, i) => (
            <li key={p.id}>
              <Link href={`/admin/productos/${p.id}`} className="flex items-center gap-3 p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors group">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  i === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm" :
                  i === 1 ? "bg-slate-100 text-slate-500" : "bg-slate-50 text-slate-400"
                }`}>{i + 1}</span>
                <span className="flex-1 text-sm text-slate-600 group-hover:text-slate-900 transition-colors truncate">{p.name}</span>
                <span className="text-xs text-slate-400 tabular-nums font-medium">{p.viewCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

async function CatalogStatus() {
  const [totalProducts, productsWithoutImages, productsWithoutVariants, totalGallery] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { images: { none: {} } } }),
      prisma.product.count({ where: { variants: { none: {} } } }),
      prisma.galleryPhoto.count(),
    ]);

  const items = [
    {
      label: "Imágenes",
      ok: productsWithoutImages === 0,
      pct: totalProducts > 0 ? Math.round(((totalProducts - productsWithoutImages) / totalProducts) * 100) : 100,
      total: totalProducts,
    },
    {
      label: "Precios",
      ok: productsWithoutVariants === 0,
      pct: totalProducts > 0 ? Math.round(((totalProducts - productsWithoutVariants) / totalProducts) * 100) : 100,
      total: totalProducts,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2.5 text-sm">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20 flex items-center justify-center">
          <Package className="w-3.5 h-3.5 text-white" />
        </div>
        Estado del catálogo
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.ok ? "bg-emerald-50" : "bg-red-50"}`}>
              {item.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                {item.total > 0 && (
                  <span className={`text-xs font-bold ${item.ok ? "text-emerald-500" : "text-red-500"}`}>{item.pct}%</span>
                )}
              </div>
              {item.total > 0 && (
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                  <div className={`h-full rounded-full transition-all duration-700 ${item.ok ? "bg-emerald-500" : "bg-red-400"}`} style={{ width: `${item.pct}%` }} />
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-blue-50">
            <Images className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700">Galería</p>
            <p className="text-xs text-slate-400 mt-0.5">{totalGallery} foto{totalGallery !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

/* ─── Quick actions (static, no data needed) ─── */

const quickActions = [
  { label: "Nuevo producto", href: "/admin/productos/nuevo", icon: Plus, gradient: "from-slate-800 to-slate-900", text: "text-white" },
  { label: "Nueva categoría", href: "/admin/categorias/nueva", icon: Tag, gradient: "", text: "text-slate-700" },
  { label: "Carga masiva", href: "/admin/carga-masiva", icon: UploadCloud, gradient: "", text: "text-slate-700" },
  { label: "Galería", href: "/admin/galeria", icon: Images, gradient: "", text: "text-slate-700" },
  { label: "Configuración", href: "/admin/configuracion", icon: Settings, gradient: "", text: "text-slate-700" },
];

/* ─── Page ─── */

export default function AdminDashboard() {
  return (
    <>
      <AdminTopBar title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

        <Suspense fallback={null}>
          <AlertsBanner />
        </Suspense>

        <Suspense fallback={<StatsSkeleton />}>
          <StatsCards />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <TopProducts />
            <CatalogStatus />
          </div>
        </Suspense>

        {/* Quick actions - renders instantly, no data */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="font-semibold text-slate-800 mb-4 text-sm">Accesos rápidos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              const isPrimary = !!action.gradient;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`group flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 text-center ${
                    isPrimary && action.gradient
                      ? `bg-gradient-to-br ${action.gradient} border-transparent ${action.text} hover:shadow-lg hover:shadow-slate-900/10 hover:-translate-y-0.5`
                      : `bg-white border-slate-100 ${action.text} hover:border-slate-200 hover:shadow-md hover:shadow-slate-100/50 hover:-translate-y-0.5`
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isPrimary && action.gradient ? "bg-white/10" : "bg-slate-50 group-hover:bg-slate-100"
                  }`}>
                    <ActionIcon className="w-[18px] h-[18px]" />
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
