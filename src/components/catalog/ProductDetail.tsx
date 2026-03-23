"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import ProductCard from "./ProductCard";
import { MessageCircle, Shield, Clock, ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Material { id: number; name: string; }
interface Measurement { id: number; label: string; }
interface Variant { id: number; price: number | string; material: Material | null; measurement: Measurement | null; }
interface ProductImage { id: number; url: string; altText: string | null; }

interface Product {
  id: number; name: string; slug: string; description: string | null;
  warrantyMonths: number | null; productionDays: number | null;
  category: { id: number; name: string; slug: string };
  images: ProductImage[];
  variants: Variant[];
}

interface RelatedProduct {
  id: number; name: string; slug: string;
  category: { name: string; slug: string };
  images: { url: string; altText?: string | null }[];
  variants: { price: number | string }[];
}

export default function ProductDetail({ product, related }: { product: Product; related: RelatedProduct[] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<number | null>(null);

  // Materiales únicos disponibles
  const materials = Array.from(
    new Map(
      product.variants.filter((v) => v.material).map((v) => [v.material!.id, v.material!])
    ).values()
  );

  // Medidas disponibles para el material seleccionado
  const availableMeasurements = Array.from(
    new Map(
      product.variants
        .filter((v) => !selectedMaterial || v.material?.id === selectedMaterial)
        .filter((v) => v.measurement)
        .map((v) => [v.measurement!.id, v.measurement!])
    ).values()
  );

  // Variante seleccionada actual
  const selectedVariant = product.variants.find((v) => {
    if (selectedMaterial && v.material?.id !== selectedMaterial) return false;
    if (selectedMeasurement && v.measurement?.id !== selectedMeasurement) return false;
    return true;
  }) ?? product.variants[0];

  const price = selectedVariant ? Number(selectedVariant.price) : null;
  const waUrl = selectedVariant
    ? buildWhatsAppUrl({
        productName: product.name,
        material: selectedVariant.material?.name,
        measurement: selectedVariant.measurement?.label,
        price: price ?? undefined,
      })
    : buildWhatsAppUrl({ productName: product.name });

  function prevImage() {
    setSelectedImage((i) => (i > 0 ? i - 1 : product.images.length - 1));
  }
  function nextImage() {
    setSelectedImage((i) => (i < product.images.length - 1 ? i + 1 : 0));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link href={`/categoria/${product.category.slug}`} className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#1C1C1E] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {product.category.name}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Galería */}
        <div>
          {/* Imagen principal */}
          <div
            className="relative aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden cursor-zoom-in mb-3"
            onClick={() => setLightbox(true)}
          >
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].altText ?? product.name}
                fill className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {product.images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                  <ChevronLeft className="w-4 h-4 text-[#1C1C1E]" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#1C1C1E]" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${i === selectedImage ? "border-[#C9A96E]" : "border-transparent hover:border-gray-200"}`}
                >
                  <Image src={img.url} alt={img.altText ?? ""} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info del producto */}
        <div>
          <p className="text-sm text-[#8B7355] font-medium mb-2">{product.category.name}</p>
          <h1
            className="text-2xl md:text-3xl font-bold text-[#1C1C1E] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {product.name}
          </h1>

          {/* Precio */}
          <div className="mb-6">
            {price !== null ? (
              <p className="text-3xl font-bold text-[#1C1C1E]">{formatPrice(price)}</p>
            ) : (
              <p className="text-lg text-[#7A7A7A]">Consultá el precio por WhatsApp</p>
            )}
          </div>

          {/* Selector de Material */}
          {materials.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-[#1C1C1E] mb-2">
                Material: {selectedMaterial ? materials.find((m) => m.id === selectedMaterial)?.name : <span className="text-[#7A7A7A] font-normal">seleccioná</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {materials.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMaterial(selectedMaterial === m.id ? null : m.id); setSelectedMeasurement(null); }}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all ${selectedMaterial === m.id ? "bg-[#1C1C1E] text-white border-[#1C1C1E]" : "border-gray-200 text-[#2C2C2C] hover:border-[#8B7355]"}`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Medida */}
          {availableMeasurements.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-[#1C1C1E] mb-2">
                Medida: {selectedMeasurement ? availableMeasurements.find((m) => m.id === selectedMeasurement)?.label : <span className="text-[#7A7A7A] font-normal">seleccioná</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {availableMeasurements.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMeasurement(selectedMeasurement === m.id ? null : m.id)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all ${selectedMeasurement === m.id ? "bg-[#1C1C1E] text-white border-[#1C1C1E]" : "border-gray-200 text-[#2C2C2C] hover:border-[#8B7355]"}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA WhatsApp */}
          <a
            href={waUrl}
            target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-base mb-4"
          >
            <MessageCircle className="w-5 h-5" />
            Consultar por WhatsApp
          </a>

          {/* Info adicional */}
          <div className="flex gap-4 text-sm text-[#7A7A7A]">
            {product.warrantyMonths && (
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#8B7355]" />
                {product.warrantyMonths} meses de garantía
              </div>
            )}
            {product.productionDays && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#8B7355]" />
                ~{product.productionDays} días de fabricación
              </div>
            )}
          </div>

          {/* Descripción */}
          {product.description && (
            <div
              className="mt-6 pt-6 border-t border-gray-100 text-sm text-[#2C2C2C] leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>

      {/* Productos relacionados */}
      {related.length > 0 && (
        <section>
          <h2
            className="text-xl font-bold text-[#1C1C1E] mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            También te puede interesar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} {...p} />)}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightbox && product.images[selectedImage] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="w-7 h-7" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={product.images[selectedImage].url}
              alt={product.images[selectedImage].altText ?? product.name}
              fill className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {product.images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
