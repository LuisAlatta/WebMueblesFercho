"use client";

import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ExternalLink, Menu, ChevronDown, User } from "lucide-react";
import Link from "next/link";
import { useAdminLayout } from "./AdminShell";

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

  const displayName = session?.user?.name || session?.user?.email || "";
  const email = session?.user?.email || "";
  const initials = displayName ? getInitials(displayName) : "U";

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
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex text-xs font-medium text-slate-600 hover:text-slate-900 items-center gap-1.5 transition-colors border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-3 h-9 rounded-lg"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Ver sitio</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 h-9 pl-1 pr-2 sm:pr-2.5 rounded-lg hover:bg-slate-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]/40"
            aria-label="Menú de usuario"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C9A96E] to-[#A88B4A] text-white text-[11px] font-semibold flex items-center justify-center shrink-0 shadow-sm">
              {initials}
            </div>
            <span className="hidden sm:block text-xs font-medium text-slate-700 max-w-[120px] truncate">
              {displayName.split("@")[0]}
            </span>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6} className="min-w-[220px]">
            <DropdownMenuLabel className="flex items-center gap-2.5 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A96E] to-[#A88B4A] text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {displayName.split("@")[0]}
                </p>
                <p className="text-xs text-slate-500 truncate">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/" target="_blank" />}>
              <ExternalLink className="w-4 h-4" />
              Ver sitio
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/admin/configuracion" />}>
              <User className="w-4 h-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
