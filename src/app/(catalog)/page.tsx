import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/catalog/ProductCard";
import { ArrowRight, CheckCircle, MessageCircle } from "lucide-react";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

export const revalidate = 60;

async function getData() {
  const [categories, featuredProducts, testimonials] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { order: "asc" },
      take: 8,
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { order: "asc" }, take: 1 },
        variants: { where: { isActive: true }, select: { price: true }, orderBy: { price: "asc" } },
      },
    }),
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);
  return { categories, featuredProducts, testimonials };
}

const steps = [
  { n: "01", title: "Cotizás", desc: "Nos contactás por WhatsApp o el formulario con lo que necesitás." },
  { n: "02", title: "Diseñamos", desc: "Te enviamos un presupuesto con medidas, materiales y precio final." },
  { n: "03", title: "Fabricamos", desc: "Fabricamos tu mueble a medida con los mejores materiales." },
  { n: "04", title: "Entregamos", desc: "Hacemos la entrega e instalación en tu domicilio." },
];

export default async function HomePage() {
  const { categories, featuredProducts, testimonials } = await getData();
  const waUrl = buildSimpleWhatsAppUrl();

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1C1C1E] text-white py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#C9A96E] text-sm font-medium uppercase tracking-widest mb-4">
            Fabricación a medida
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Muebles que se adaptan{" "}
            <span className="text-[#C9A96E]">a tu espacio</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Fabricamos muebles de madera, melamina y MDF a medida. Calidad artesanal, diseño personalizado y precios accesibles.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8965e] text-[#1C1C1E] font-semibold px-7 py-3.5 rounded-lg transition-colors"
            >
              Ver catálogo <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={waUrl}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white px-7 py-3.5 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Pedir cotización
            </a>
          </div>
        </div>
      </section>

      {/* Categorías */}
      {categories.length > 0 && (
        <section className="py-16 px-4 bg-[#FAF9F7]">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold text-[#1C1C1E] mb-8 text-center"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Nuestras categorías
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className="group bg-white rounded-xl p-5 text-center border border-gray-100 hover:border-[#C9A96E] hover:shadow-md transition-all duration-300"
                >
                  {cat.imageUrl ? (
                    <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-3 bg-gray-100">
                      <Image src={cat.imageUrl} alt={cat.name} width={56} height={56} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#FAF9F7] border-2 border-[#C9A96E]/30 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-xl">🪑</span>
                    </div>
                  )}
                  <p className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#8B7355] transition-colors">
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Productos destacados */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <h2
                className="text-2xl md:text-3xl font-bold text-[#1C1C1E]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Productos destacados
              </h2>
              <Link href="/catalogo" className="text-sm text-[#8B7355] hover:text-[#1C1C1E] flex items-center gap-1 transition-colors">
                Ver todo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} {...p} isFeatured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cómo trabajamos */}
      <section className="py-16 px-4 bg-[#1C1C1E] text-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-12"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Cómo trabajamos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#C9A96E] text-[#1C1C1E] font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.n}
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/como-trabajamos"
              className="inline-flex items-center gap-2 text-[#C9A96E] hover:text-white transition-colors text-sm"
            >
              Saber más <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-16 px-4 bg-[#FAF9F7]">
        <div className="max-w-5xl mx-auto text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1C1C1E] mb-10"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🪵", title: "Materiales premium", desc: "Trabajamos con madera maciza, MDF y melamina de primera calidad." },
              { icon: "📐", title: "A medida exacta", desc: "Cada mueble se fabrica según las dimensiones exactas de tu espacio." },
              { icon: "✅", title: "Garantía incluida", desc: "Todos nuestros productos incluyen garantía por defectos de fabricación." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-[#1C1C1E] mb-2">{item.title}</h3>
                <p className="text-[#7A7A7A] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      {testimonials.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold text-[#1C1C1E] text-center mb-10"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Lo que dicen nuestros clientes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-[#FAF9F7] rounded-xl p-6 border border-gray-100">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < t.rating ? "text-[#C9A96E]" : "text-gray-200"}>★</span>
                    ))}
                  </div>
                  <p className="text-[#2C2C2C] text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                  <p className="text-[#8B7355] font-medium text-sm">— {t.clientName}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="py-16 px-4 bg-[#C9A96E]">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1C1C1E] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            ¿Tenés un proyecto en mente?
          </h2>
          <p className="text-[#1C1C1E]/70 mb-6">
            Contactanos y te asesoramos sin costo. Respondemos rápido por WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waUrl}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1C1C1E] hover:bg-[#2C2C2E] text-white font-semibold px-7 py-3.5 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Hablar por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 border-2 border-[#1C1C1E] text-[#1C1C1E] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#1C1C1E] hover:text-white transition-colors"
            >
              Formulario de contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
