"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

interface Props {
  categories: { id: number; name: string; slug: string }[];
  materials: { id: number; name: string }[];
  active: { categoria?: string; material?: string; search?: string; orden?: string };
}

export default function FilterSidebar({ categories, materials, active }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function navigate(key: string, value: string | null) {
    const params = new URLSearchParams();
    if (active.search) params.set("search", active.search);
    if (active.orden) params.set("orden", active.orden);
    if (key !== "categoria" && active.categoria) params.set("categoria", active.categoria);
    if (key !== "material" && active.material) params.set("material", active.material);
    if (value) params.set(key, value);
    const q = params.toString();
    startTransition(() => {
      router.push(`${pathname}${q ? `?${q}` : ""}`);
    });
  }

  return (
    <div className={cn("space-y-6 transition-opacity", isPending && "opacity-50 pointer-events-none")}>
      {/* Categorías */}
      <div>
        <h3 className="text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider mb-3">
          Categoría
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => navigate("categoria", null)}
              className={cn(
                "block w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
                !active.categoria
                  ? "bg-[#1C1C1E] text-white font-medium"
                  : "text-[#7A7A7A] hover:text-[#1C1C1E] hover:bg-[#FAF9F7]"
              )}
            >
              Todas
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => navigate("categoria", cat.slug)}
                className={cn(
                  "block w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
                  active.categoria === cat.slug
                    ? "bg-[#1C1C1E] text-white font-medium"
                    : "text-[#7A7A7A] hover:text-[#1C1C1E] hover:bg-[#FAF9F7]"
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Materiales */}
      {materials.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider mb-3">
            Material
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => navigate("material", null)}
                className={cn(
                  "block w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
                  !active.material
                    ? "text-[#1C1C1E] font-medium"
                    : "text-[#7A7A7A] hover:text-[#1C1C1E] hover:bg-[#FAF9F7]"
                )}
              >
                Todos
              </button>
            </li>
            {materials.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => navigate("material", m.name)}
                  className={cn(
                    "block w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors",
                    active.material === m.name
                      ? "text-[#1C1C1E] font-medium bg-[#FAF9F7]"
                      : "text-[#7A7A7A] hover:text-[#1C1C1E] hover:bg-[#FAF9F7]"
                  )}
                >
                  {m.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
