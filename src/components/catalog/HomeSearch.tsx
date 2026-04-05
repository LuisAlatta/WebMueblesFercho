"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Result {
  id: number;
  name: string;
  slug: string;
  category: { name: string };
  images: { url: string }[];
}

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(
        `/api/productos?search=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();
      setResults(data.products ?? []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(query)}`);
      setFocused(false);
    }
  }

  const showResults = focused && query.length >= 2;

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-2.5 bg-[#f5f3f0] rounded-xl px-4 py-2.5">
        {loading ? (
          <Loader2 className="w-4.5 h-4.5 text-[#999] animate-spin shrink-0" />
        ) : (
          <Search className="w-4.5 h-4.5 text-[#999] shrink-0" />
        )}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar muebles..."
          className="flex-1 text-sm outline-none bg-transparent text-[#1C1C1E] placeholder:text-[#999]"
        />
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {results.length > 0 ? (
            <>
              <ul className="py-1">
                {results.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/producto/${r.slug}`}
                      onClick={() => setFocused(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAF9F7] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {r.images[0] && (
                          <Image
                            src={r.images[0].url}
                            alt={r.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-[#1C1C1E] truncate">{r.name}</p>
                        <p className="text-xs text-[#999]">{r.category.name}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/catalogo?search=${encodeURIComponent(query)}`}
                onClick={() => setFocused(false)}
                className="block text-xs text-center text-[#C9A96E] font-medium py-2.5 border-t border-gray-100 hover:bg-[#FAF9F7] transition-colors"
              >
                Ver todos los resultados
              </Link>
            </>
          ) : !loading ? (
            <p className="text-xs text-[#999] text-center py-4">
              Sin resultados para &quot;{query}&quot;
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
