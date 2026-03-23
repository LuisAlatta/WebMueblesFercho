"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminTopBarProps {
  title: string;
}

export default function AdminTopBar({ title }: AdminTopBarProps) {
  const { data: session } = useSession();

  return (
    <header className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0">
      <h1 className="text-base font-semibold text-[#1C1C1E]">{title}</h1>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="text-sm text-[#7A7A7A] hover:text-[#1C1C1E] flex items-center gap-1 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Ver sitio
        </Link>

        <div className="h-4 w-px bg-gray-200" />

        <span className="text-sm text-[#7A7A7A]">
          {session?.user?.name || session?.user?.email}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-[#7A7A7A] hover:text-red-500 h-8 px-2"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
