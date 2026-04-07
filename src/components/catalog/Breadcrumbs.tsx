import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-[#7A7A7A] mb-4 overflow-x-auto">
      <Link href="/" className="shrink-0 hover:text-[#1C1C1E] transition-colors">
        Inicio
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1 shrink-0">
          <ChevronRight className="w-3 h-3" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#1C1C1E] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#1C1C1E] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
