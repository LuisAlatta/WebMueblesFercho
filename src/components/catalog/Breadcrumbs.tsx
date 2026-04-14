"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCatalogType } from "./CatalogTypeProvider";

interface Crumb {
  label: string;
  href?: string;
  categorySlug?: string; // used to build catalog URL with category filter
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { catalogType } = useCatalogType();

  function resolveHref(item: Crumb): string | undefined {
    if (item.categorySlug) {
      return `/catalogo/${catalogType}?categoria=${item.categorySlug}`;
    }
    return item.href;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-[#7A7A7A] mb-4 overflow-x-auto">
      <Link href={`/catalogo/${catalogType}`} className="shrink-0 hover:text-[#1C1C1E] transition-colors">
        Catálogo
      </Link>
      {items.map((item, i) => {
        const href = resolveHref(item);
        return (
          <span key={i} className="flex items-center gap-1 shrink-0">
            <ChevronRight className="w-3 h-3" />
            {href ? (
              <Link href={href} className="hover:text-[#1C1C1E] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#1C1C1E] font-medium">{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
