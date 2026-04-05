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
        "flex flex-col transition-all duration-300 ease-in-out",
        // Gradient background
        "bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white",
        // Mobile: fixed drawer
        "fixed inset-y-0 left-0 z-30 w-72",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: static in flex layout
        "lg:relative lg:translate-x-0 lg:z-auto lg:shrink-0",
        collapsed ? "lg:w-[68px]" : "lg:w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div className="w-9 h-9 bg-gradient-to-br from-[#C9A96E] to-[#A88B4A] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#C9A96E]/20">
          <span className="text-white font-bold text-sm tracking-tight">MF</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm leading-tight flex-1 truncate tracking-tight">
            Muebles Fercho
          </span>
        )}
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
                active
                  ? "bg-gradient-to-r from-[#C9A96E]/20 to-[#C9A96E]/5 text-[#C9A96E] shadow-sm shadow-[#C9A96E]/5"
                  : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
              )}
            >
              <Icon className={cn("w-[18px] h-[18px] shrink-0", active && "drop-shadow-[0_0_6px_rgba(201,169,110,0.4)]")} />
              <span className="lg:hidden">{item.label}</span>
              {!collapsed && <span className="hidden lg:inline">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button - desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-[#1E293B] border border-white/10 rounded-full items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-colors shadow-md"
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
