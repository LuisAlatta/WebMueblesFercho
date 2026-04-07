"use client";

import { useState, useCallback } from "react";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 12;

interface Product {
  id: number;
  name: string;
  slug: string;
  category: { name: string; slug: string };
  images: { url: string; altText?: string | null }[];
  variants: { price: number | string }[];
  isFeatured?: boolean;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + PAGE_SIZE, products.length));
  }, [products.length]);

  const shown = products.slice(0, visible);
  const hasMore = visible < products.length;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {shown.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-8 py-3 text-sm font-medium text-[#1C1C1E] border border-gray-200 rounded-xl hover:border-[#1C1C1E] active:scale-[0.97] transition-all"
          >
            Cargar más productos ({products.length - visible} restantes)
          </button>
        </div>
      )}
    </>
  );
}
