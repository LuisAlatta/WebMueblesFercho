"use client";

const options = [
  { value: "", label: "Destacados" },
  { value: "nuevos", label: "Más nuevos" },
  { value: "precio_asc", label: "Precio: menor a mayor" },
  { value: "precio_desc", label: "Precio: mayor a menor" },
];

export default function OrdenSelect({ current }: { current?: string }) {
  return (
    <select
      name="orden"
      defaultValue={current ?? ""}
      onChange={(e) => {
        const url = new URL(window.location.href);
        if (e.target.value) url.searchParams.set("orden", e.target.value);
        else url.searchParams.delete("orden");
        window.location.href = url.toString();
      }}
      className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-[#2C2C2C] bg-white outline-none focus:border-[#C9A96E] cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
