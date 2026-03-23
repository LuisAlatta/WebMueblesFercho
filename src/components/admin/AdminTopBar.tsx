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
    <header className="h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        {/* Mobile hamburger */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-[#7A7A7A] hover:text-[#1C1C1E] transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-[#1C1C1E] truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex text-sm text-[#7A7A7A] hover:text-[#1C1C1E] items-center gap-1 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Ver sitio</span>
        </Link>

        <div className="hidden sm:block h-4 w-px bg-gray-200" />

        <span className="hidden sm:block text-sm text-[#7A7A7A] max-w-[140px] truncate">
          {session?.user?.name || session?.user?.email}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-[#7A7A7A] hover:text-red-500 h-8 w-8 p-0"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
