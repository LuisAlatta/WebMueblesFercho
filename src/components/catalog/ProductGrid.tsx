"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 12;

interface Product {
  id: number;
  name: string;
  slug: string;
  category: { name: string; slug: string };
  images: { url: string; altText?: string | null }[];
  isFeatured?: boolean;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + PAGE_SIZE, products.length));
  }, [products.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // Reset visible count when products change (filter/sort)
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [products]);

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
        <div ref={sentinelRef} className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-sm text-[#7A7A7A]">
            <div className="w-4 h-4 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
            Cargando más productos...
          </div>
        </div>
      )}
    </>
  );
}
