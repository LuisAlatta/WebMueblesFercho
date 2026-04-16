"use client";

import Link from "next/link";
import Image from "next/image";
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
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Principal",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/productos", label: "Productos", icon: Package },
      { href: "/admin/categorias", label: "Categorías", icon: Tag },
      { href: "/admin/materiales", label: "Materiales", icon: Layers },
      { href: "/admin/medidas", label: "Medidas", icon: Ruler },
      { href: "/admin/sets", label: "Combos", icon: Sofa },
      { href: "/admin/carga-masiva", label: "Carga masiva", icon: UploadCloud },
    ],
  },
  {
    label: "Contenido",
    items: [
      { href: "/admin/galeria", label: "Galería", icon: Images },
      { href: "/admin/testimonios", label: "Testimonios", icon: Star },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
    ],
  },
  {
    label: "Sistema",
    items: [{ href: "/admin/configuracion", label: "Configuración", icon: Settings }],
  },
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

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <aside
      className={cn(
        "flex flex-col transition-[width] duration-300 ease-in-out",
        "bg-gradient-to-b from-[#0B1220] via-[#111827] to-[#0B1220] text-white",
        "fixed inset-y-0 left-0 z-30 w-72",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "lg:relative lg:translate-x-0 lg:z-auto lg:shrink-0",
        collapsed ? "lg:w-[72px]" : "lg:w-64"
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] shrink-0",
          collapsed && "lg:justify-center lg:px-2"
        )}
      >
        <div className="w-9 h-9 rounded-xl bg-white/95 flex items-center justify-center shrink-0 shadow-lg shadow-[#C9A96E]/10 ring-1 ring-[#C9A96E]/30 overflow-hidden">
          <Image
            src="/images/favicon fercho.png"
            alt="Muebles Fercho"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
        <div className={cn("flex-1 min-w-0", collapsed && "lg:hidden")}>
          <p className="font-semibold text-sm leading-tight truncate tracking-tight">
            Muebles Fercho
          </p>
          <p className="text-[11px] text-white/40 leading-tight mt-0.5">Admin</p>
        </div>
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="Cerrar menú"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto px-3">
        {navGroups.map((group, gi) => (
          <div key={group.label} className={cn(gi > 0 && "mt-5")}>
            <p
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30 px-3 mb-2",
                collapsed && "lg:hidden"
              )}
            >
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg text-[13px] font-medium transition-colors duration-150 h-9",
                      collapsed ? "lg:justify-center lg:px-0" : "px-3",
                      active
                        ? "bg-white/[0.08] text-white"
                        : "text-white/55 hover:bg-white/[0.04] hover:text-white/90"
                    )}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#C9A96E]",
                          collapsed && "lg:hidden"
                        )}
                      />
                    )}
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] shrink-0 transition-colors",
                        active ? "text-[#C9A96E]" : "text-white/50"
                      )}
                    />
                    <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={cn(
          "border-t border-white/[0.06] px-4 py-3 shrink-0",
          collapsed && "lg:px-2 lg:text-center"
        )}
      >
        <p className={cn("text-[10px] text-white/30", collapsed && "lg:hidden")}>
          v1.0 · {new Date().getFullYear()}
        </p>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="hidden lg:flex absolute -right-3 top-[68px] w-6 h-6 bg-[#111827] border border-white/15 rounded-full items-center justify-center text-white/50 hover:text-white hover:border-[#C9A96E]/50 hover:bg-[#1F2937] transition-all shadow-md z-10"
        aria-label={collapsed ? "Expandir" : "Colapsar"}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
