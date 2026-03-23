"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

interface Props {
  categories: { id: number; name: string; slug: string }[];
  materials: { id: number; name: string }[];
  active: { categoria?: string; material?: string; search?: string; orden?: string };
}

export default function MobileFilterDrawer({ categories, materials, active }: Props) {
  const [open, setOpen] = useState(false);
  const hasActiveFilters = !!(active.categoria || active.material);

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Botón disparador — solo visible en mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#444] hover:border-[#1C1C1E] active:bg-gray-50 transition-colors relative"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C9A96E] rounded-full" />
        )}
      </button>

      {/* Overlay oscuro */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "82vh" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-[#1C1C1E]">Filtros</h2>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-[#777] hover:text-[#1C1C1E] rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto px-5 py-5" style={{ maxHeight: "calc(82vh - 130px)" }}>
          <FilterSidebar categories={categories} materials={materials} active={active} />
        </div>

        {/* Footer con botón aplicar */}
        <div className="px-5 pb-6 pt-3 border-t border-gray-100">
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-[#1C1C1E] hover:bg-[#333] text-white font-semibold py-4 rounded-xl transition-colors"
          >
            Ver resultados
          </button>
        </div>
      </div>
    </>
  );
}
