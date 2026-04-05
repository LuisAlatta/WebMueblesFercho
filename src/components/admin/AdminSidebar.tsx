"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Tag,
  Layers,
  Ruler,
  Images,
  Star,
  HelpCircle,
  Settings,
  Sofa,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tag },
  { href: "/admin/materiales", label: "Materiales", icon: Layers },
  { href: "/admin/medidas", label: "Medidas", icon: Ruler },
  { href: "/admin/sets", label: "Sets", icon: Sofa },
  { href: "/admin/carga-masiva", label: "Carga masiva", icon: UploadCloud },
  { href: "/admin/galeria", label: "Galería", icon: Images },
  { href: "/admin/testimonios", label: "Testimonios", icon: Star },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#1C1C1E] text-white transition-all duration-300 ease-in-out",
        // Mobile: fixed drawer
        "fixed inset-y-0 left-0 z-30 w-72",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: static in flex layout
        "lg:relative lg:translate-x-0 lg:z-auto lg:shrink-0",
        collapsed ? "lg:w-16" : "lg:w-56"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-[#C9A96E] rounded-lg flex items-center justify-center shrink-0">
          <span className="text-[#1C1C1E] font-bold text-sm">MF</span>
        </div>
        {!collapsed && (
          <span
            className="font-semibold text-sm leading-tight flex-1 truncate"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Muebles Fercho
          </span>
        )}
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-[#C9A96E] text-[#1C1C1E] font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="lg:hidden">{item.label}</span>
              {!collapsed && <span className="hidden lg:inline">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button - desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-[#1C1C1E] border border-white/20 rounded-full items-center justify-center text-white/60 hover:text-white transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
