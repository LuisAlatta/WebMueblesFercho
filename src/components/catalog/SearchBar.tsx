"use client";

import { useState, useEffect } from "react";
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

export default function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/productos?search=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setResults(data.products ?? []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(query)}`);
      onClose?.();
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 px-2 py-1">
        {loading ? (
          <Loader2 className="w-4 h-4 text-[#7A7A7A] animate-spin shrink-0" />
        ) : (
          <Search className="w-4 h-4 text-[#7A7A7A] shrink-0" />
        )}
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar muebles..."
          className="flex-1 text-sm outline-none bg-transparent text-[#1C1C1E] placeholder:text-[#7A7A7A]"
        />
      </div>

      {results.length > 0 && (
        <ul className="mt-2 border-t border-gray-100 pt-2 space-y-1">
          {results.map((r) => (
            <li key={r.id}>
              <Link
                href={`/producto/${r.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#FAF9F7] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {r.images[0] && (
                    <Image src={r.images[0].url} alt={r.name} width={36} height={36} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[#1C1C1E] truncate">{r.name}</p>
                  <p className="text-xs text-[#7A7A7A]">{r.category.name}</p>
                </div>
              </Link>
            </li>
          ))}
          <li className="pt-1 border-t border-gray-100">
            <Link
              href={`/catalogo?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="block text-xs text-center text-[#C9A96E] py-1.5 hover:underline"
            >
              Ver todos los resultados
            </Link>
          </li>
        </ul>
      )}

      {query.length >= 2 && results.length === 0 && !loading && (
        <p className="text-xs text-[#7A7A7A] text-center py-3">Sin resultados para &quot;{query}&quot;</p>
      )}
    </div>
  );
}
