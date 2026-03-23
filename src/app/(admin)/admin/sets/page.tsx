import AdminTopBar from "@/components/admin/AdminTopBar";

export default function SetsPage() {
  return (
    <>
      <AdminTopBar title="Sets de productos" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center max-w-md mx-auto mt-8">
          <p className="text-[#7A7A7A] text-sm">
            Los sets de productos te permiten agrupar artículos que combinan bien juntos
            (ej: &quot;Dormitorio completo&quot;).
          </p>
          <p className="text-[#C9A96E] text-sm mt-2">Disponible en próxima actualización.</p>
        </div>
      </main>
    </>
  );
}
