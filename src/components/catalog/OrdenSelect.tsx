"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const options = [
  { value: "", label: "Destacados" },
  { value: "nuevos", label: "Más nuevos" },
  { value: "precio_asc", label: "Precio: menor a mayor" },
  { value: "precio_desc", label: "Precio: mayor a menor" },
];

export default function OrdenSelect({ current }: { current?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (e.target.value) params.set("orden", e.target.value);
      else params.delete("orden");
      const q = params.toString();
      startTransition(() => {
        router.push(`/catalogo${q ? `?${q}` : ""}`);
      });
    },
    [router, searchParams, startTransition]
  );

  return (
    <select
      name="orden"
      defaultValue={current ?? ""}
      onChange={handleChange}
      disabled={isPending}
      className={`text-sm border border-gray-200 rounded-lg px-3 py-2 text-[#2C2C2C] bg-white outline-none focus:border-[#C9A96E] cursor-pointer transition-opacity ${isPending ? "opacity-60" : ""}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
