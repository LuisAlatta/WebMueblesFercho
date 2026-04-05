"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, ExternalLink, Menu } from "lucide-react";
import Link from "next/link";
import { useAdminLayout } from "./AdminShell";

interface AdminTopBarProps {
  title: string;
}

export default function AdminTopBar({ title }: AdminTopBarProps) {
  const { data: session } = useSession();
  const { toggleMobileMenu } = useAdminLayout();

  return (
    <header className="h-14 border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-5 flex items-center justify-between shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-slate-800 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex text-xs text-slate-400 hover:text-slate-600 items-center gap-1.5 transition-colors bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Ver sitio</span>
        </Link>

        <div className="hidden sm:block h-5 w-px bg-slate-200" />

        <span className="hidden sm:block text-xs text-slate-400 max-w-[140px] truncate">
          {session?.user?.name || session?.user?.email}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0 rounded-lg"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
