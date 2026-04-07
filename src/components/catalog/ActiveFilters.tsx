"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { X } from "lucide-react";

interface Props {
  filters: { categoria?: string; material?: string; search?: string; orden?: string };
  categoryName?: string;
}

export default function ActiveFilters({ filters, categoryName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const chips: { label: string; key: string }[] = [];
  if (filters.categoria) chips.push({ label: categoryName || filters.categoria, key: "categoria" });
  if (filters.material) chips.push({ label: filters.material, key: "material" });

  if (chips.length === 0) return null;

  function remove(key: string) {
    const params = new URLSearchParams();
    if (key !== "categoria" && filters.categoria) params.set("categoria", filters.categoria);
    if (key !== "material" && filters.material) params.set("material", filters.material);
    if (filters.search) params.set("search", filters.search);
    if (filters.orden) params.set("orden", filters.orden);
    const q = params.toString();
    startTransition(() => {
      router.push(`${pathname}${q ? `?${q}` : ""}`);
    });
  }

  return (
    <div className={`flex flex-wrap gap-2 mb-4 transition-opacity ${isPending ? "opacity-50" : ""}`}>
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => remove(chip.key)}
          className="inline-flex items-center gap-1.5 bg-[#1C1C1E] text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#333] transition-colors"
        >
          {chip.label}
          <X className="w-3 h-3" />
        </button>
      ))}
    </div>
  );
}
