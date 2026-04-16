"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, Menu, ChevronDown, ShoppingBag, Store } from "lucide-react";
import { useAdminLayout } from "./AdminShell";
import { useState, useRef, useEffect } from "react";

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
}

function getInitials(nameOrEmail: string): string {
  const source = nameOrEmail.split("@")[0];
  const parts = source.split(/[.\s_-]+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function AdminTopBar({ title, subtitle }: AdminTopBarProps) {
  const { data: session } = useSession();
  const { toggleMobileMenu } = useAdminLayout();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = session?.user?.name || session?.user?.email || "";
  const email = session?.user?.email || "";
  const initials = displayName ? getInitials(displayName) : "U";

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [open]);

  return (
    <header className="h-16 border-b border-slate-200/70 bg-white/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold text-slate-900 tracking-tight leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 leading-tight truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Avatar dropdown — no Portal, no base-ui */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 h-9 pl-1 pr-2 sm:pr-2.5 rounded-lg hover:bg-slate-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]/40"
            aria-label="Menú de usuario"
            aria-expanded={open}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C9A96E] to-[#A88B4A] text-white text-[11px] font-semibold flex items-center justify-center shrink-0 shadow-sm">
              {initials}
            </div>
            <span className="hidden sm:block text-xs font-medium text-slate-700 max-w-[120px] truncate">
              {displayName.split("@")[0]}
            </span>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black/10 py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
              {/* User info */}
              <div className="flex items-center gap-2.5 px-3 py-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A96E] to-[#A88B4A] text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {displayName.split("@")[0]}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{email}</p>
                </div>
              </div>

              <div className="h-px bg-slate-100 mx-1 my-1" />

              {/* Catálogo por menor */}
              <button
                onClick={() => {
                  setOpen(false);
                  window.open("/catalogo/min", "_blank");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                Catálogo por menor
              </button>

              {/* Catálogo por mayor */}
              <button
                onClick={() => {
                  setOpen(false);
                  window.open("/catalogo/max", "_blank");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Store className="w-4 h-4 text-slate-400" />
                Catálogo por mayor
              </button>

              <div className="h-px bg-slate-100 mx-1 my-1" />

              {/* Cerrar sesión */}
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
