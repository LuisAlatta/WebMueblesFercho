"use client";

import { use } from "react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ProductEditor from "@/components/admin/ProductEditor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <>
      <AdminTopBar title="Editar producto" />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Link href="/admin/productos" className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#1C1C1E] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a productos
        </Link>
        <ProductEditor productId={parseInt(id)} />
      </main>
    </>
  );
}
