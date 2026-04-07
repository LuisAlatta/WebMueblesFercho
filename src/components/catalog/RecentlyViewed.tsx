"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface RecentProduct {
  slug: string;
  name: string;
  image: string;
  category: string;
}

const STORAGE_KEY = "mf-recently-viewed";
const MAX_ITEMS = 6;

export function trackProductView(product: RecentProduct) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as RecentProduct[];
    const filtered = stored.filter((p) => p.slug !== product.slug);
    filtered.unshift(product);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch {}
}

export default function RecentlyViewed({ excludeSlug }: { excludeSlug: string }) {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as RecentProduct[];
      setItems(stored.filter((p) => p.slug !== excludeSlug).slice(0, 4));
    } catch {}
  }, [excludeSlug]);

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2
        className="text-xl font-bold text-[#1C1C1E] mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Visto recientemente
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {items.map((p) => (
          <Link
            key={p.slug}
            href={`/producto/${p.slug}`}
            className="shrink-0 w-28 group"
          >
            <div className="relative aspect-[3/5] rounded-xl overflow-hidden bg-[#f0ece6] mb-1.5">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="112px"
              />
            </div>
            <p className="text-[10px] text-[#C9A96E] uppercase tracking-wider truncate">{p.category}</p>
            <p className="text-xs text-[#1C1C1E] font-medium line-clamp-1">{p.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
