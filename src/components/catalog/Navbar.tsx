"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useCatalogType } from "./CatalogTypeProvider";

const SearchBar = dynamic(() => import("./SearchBar"), { ssr: false });

const navLinks = [
  { href: "/catalogo", label: "Catalogo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/galeria", label: "Galeria" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar({ businessName }: { businessName: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const { catalogType } = useCatalogType();

  const dynamicNavLinks = navLinks.map(l => {
    if (l.label === "Catalogo") {
      return { ...l, href: `/catalogo/${catalogType}` };
    }
    return l;
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-[#1C1C1E] transition-shadow duration-300",
        scrolled ? "shadow-lg shadow-black/20" : ""
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span
            className="block text-xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {businessName}
          </span>
          <span className="block text-[10px] text-[#C9A96E] uppercase tracking-[0.2em] font-medium">
            Fabricación a medida
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-0">
          {dynamicNavLinks.map((l) => {
            const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.label === "Catalogo" ? "/catalogo" : l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative px-4 py-2 text-sm transition-colors duration-200 group",
                  isActive ? "text-white font-medium" : "text-white/60 hover:text-white"
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute bottom-0 left-4 right-4 h-0.5 bg-[#C9A96E] transition-transform duration-300 origin-left",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Buscar"
              className="p-2 text-white/75 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50">
                <SearchBar onClose={() => setSearchOpen(false)} />
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            className="md:hidden p-2 text-white/75 hover:text-white transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-white/10 bg-[#1C1C1E] px-6 py-4 space-y-1 shadow-lg">
          {dynamicNavLinks.map((l) => {
            const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.label === "Catalogo" ? "/catalogo" : l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center py-3 text-sm border-b border-white/5 transition-colors",
                  isActive
                    ? "text-white font-semibold"
                    : "text-white/60 hover:text-white"
                )}
              >
                {isActive && <span className="w-1 h-4 bg-[#C9A96E] mr-3 rounded-full" />}
                {l.label}
              </Link>
            );
          })}
          <div className="pt-3">
            <Link
              href="/contacto"
              className="block text-center bg-[#C9A96E] text-[#1C1C1E] text-xs uppercase tracking-widest py-3 rounded-xl font-semibold hover:bg-[#b8965e] transition-colors"
            >
              Pedir cotización
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
