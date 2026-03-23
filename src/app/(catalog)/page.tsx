import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/catalog/ProductCard";
import AnimatedSection from "@/components/catalog/AnimatedSection";
import HeroSlider, { type HeroSlide } from "@/components/catalog/HeroSlider";
import { ArrowRight, MessageCircle } from "lucide-react";
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
    }).then((ps) => ps.map((p) => ({ ...p, variants: p.variants.map((v) => ({ price: Number(v.price) })) }))),
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
  const { categories: dbCategories, featuredProducts, testimonials } = await getData();
  const waUrl = buildSimpleWhatsAppUrl();

  // Ensure 'Baños' category exists for the home grid
  const categories = dbCategories.some((c) => c.name.toLowerCase().includes("baño"))
    ? dbCategories
    : [
        ...dbCategories,
        {
          id: 999,
          name: "Baños",
          slug: "banos",
          imageUrl: "/images/cat-banos.png",
          isActive: true,
          description: "Amoblamientos para baño a medida.",
          order: 99,
          createdAt: new Date(),
        },
      ].slice(0, 6);

  // Build hero slides from categories with images
  const heroSlides: HeroSlide[] = categories
    .filter((c) => c.imageUrl)
    .slice(0, 3)
    .map((c) => ({
      label: "Fabricación a medida",
      title: c.name,
      subtitle: c.description ?? "Diseños exclusivos fabricados a medida para tu hogar.",
      imageUrl: c.imageUrl!,
      href: `/categoria/${c.slug}`,
    }));

  const bannerCats = categories.slice(0, 2);

  return (
    <>
      {/* ── Hero Slider ─────────────────────────────────────────── */}
      <HeroSlider slides={heroSlides.length >= 2 ? heroSlides : undefined} />

      {/* ── Intro "¡Fabricamos..." ───────────────────────────────── */}
      <section className="relative py-28 px-6 text-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/wood-intro-bg.png"
            alt="Fondo de madera"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/85" />
        </div>

        <div className="relative z-10">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A96E] mb-4">
              Muebles Fercho · Rosario
            </p>
            <h2
              className="text-3xl md:text-5xl font-bold text-[#1C1C1E] max-w-3xl mx-auto leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              ¡Fabricamos los muebles que soñaste!
            </h2>
            <p className="text-[#555] text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
              Somos especialistas en muebles a medida en madera, MDF y melamina.
              Diseño personalizado, calidad artesanal y precios accesibles.
            </p>
            <Link
              href="/nosotros"
              className="inline-flex items-center gap-2 border border-[#1C1C1E] text-[#1C1C1E] text-xs uppercase tracking-widest px-8 py-3.5 hover:bg-[#1C1C1E] hover:text-white transition-all duration-300"
            >
              Conocé más <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Dos categorías principales (banners) ─────────────────── */}
      {bannerCats.length >= 2 && (
        <section className="flex flex-col md:flex-row h-auto md:h-[560px]">
          {bannerCats.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="group relative flex-1 overflow-hidden min-h-[320px] md:min-h-0"
            >
              {/* Background */}
              <Image
                src={i === 0 ? "/images/linea-hogar-dormitorios.png" : "/images/linea-premium-living.png"}
                alt={i === 0 ? "Dormitorios" : "Living"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A96E] mb-3">
                  {i === 0 ? "Línea Hogar" : "Línea Premium"}
                </p>
                <h3
                  className="text-3xl md:text-4xl font-bold mb-5"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {i === 0 ? "Dormitorios" : "Living"}
                </h3>
                <span className="border border-white/70 text-white text-[10px] uppercase tracking-[0.2em] px-7 py-3 group-hover:bg-white group-hover:text-[#1C1C1E] transition-all duration-300">
                  Ver colección
                </span>
              </div>

              {/* Divider (only first on desktop) */}
              {i === 0 && <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-white/20 z-10" />}
            </Link>
          ))}
        </section>
      )}

      {/* ── Categorías (si hay más de 2) ─────────────────────────── */}
      {categories.length > 0 && (
        <section className="relative py-24 px-6 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/wood-categories-bg.png"
              alt="Fondo de categorías"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/65" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A96E] mb-3">
                  Lo que fabricamos
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Nuestras categorías
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categoria/${cat.slug}`}
                    className="group relative overflow-hidden aspect-square border border-white/10"
                  >
                    {cat.name.toLowerCase().includes("dormitorio") ? (
                      <Image
                        src="/images/cat-dormitorios.png"
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : cat.name.toLowerCase().includes("living") ? (
                      <Image
                        src="/images/cat-living.png"
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : cat.name.toLowerCase().includes("comedor") ? (
                      <Image
                        src="/images/cat-comedor.png"
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : cat.name.toLowerCase().includes("cocina") ? (
                      <Image
                        src="/images/cat-cocina.png"
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : cat.name.toLowerCase().includes("oficina") ? (
                      <Image
                        src="/images/cat-oficina.png"
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : cat.name.toLowerCase().includes("baño") ? (
                      <Image
                        src="/images/cat-banos.png"
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <span className="text-3xl opacity-40">🪑</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300 flex items-end">
                      <div className="w-full bg-gradient-to-t from-black/90 to-transparent p-4">
                        <p className="text-white text-[11px] font-semibold uppercase tracking-wider leading-tight">
                          {cat.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ── Productos destacados ─────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A96E] mb-2">
                    Selección curada
                  </p>
                  <h2
                    className="text-3xl md:text-4xl font-bold text-[#1C1C1E]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Productos destacados
                  </h2>
                </div>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-[#1C1C1E] border-b border-[#555] hover:border-[#1C1C1E] pb-0.5 transition-colors self-start md:self-auto"
                >
                  Ver todo el catálogo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                {featuredProducts.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ── Cómo trabajamos ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#1C1C1E] text-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A96E] mb-3">
                El proceso
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Cómo trabajamos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Line connector */}
              <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-px bg-[#C9A96E]/25" />

              {steps.map((step) => (
                <div key={step.n} className="text-center relative">
                  <div className="w-14 h-14 rounded-full bg-[#C9A96E] text-[#1C1C1E] font-bold text-lg flex items-center justify-center mx-auto mb-5 relative z-10">
                    {step.n}
                  </div>
                  <h3 className="font-semibold text-white text-base mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/como-trabajamos"
                className="inline-flex items-center gap-2 text-[#C9A96E] text-xs uppercase tracking-widest hover:text-white transition-colors group"
              >
                Saber más <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Por qué elegirnos ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#f8f6f3]">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A96E] mb-3">
                Nuestros valores
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#1C1C1E]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                ¿Por qué elegirnos?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e0dbd5]">
              {[
                { icon: "🪵", title: "Materiales premium", desc: "Trabajamos con madera maciza, MDF y melamina de primera calidad." },
                { icon: "📐", title: "A medida exacta", desc: "Cada mueble se fabrica según las dimensiones exactas de tu espacio." },
                { icon: "✅", title: "Garantía incluida", desc: "Todos nuestros productos incluyen garantía por defectos de fabricación." },
              ].map((item) => (
                <div key={item.title} className="bg-white p-10 text-center hover:bg-[#faf8f5] transition-colors duration-300">
                  <div className="text-4xl mb-5">{item.icon}</div>
                  <h3 className="font-semibold text-[#1C1C1E] text-base uppercase tracking-wide mb-3">{item.title}</h3>
                  <p className="text-[#777] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Testimonios ─────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-12">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A96E] mb-3">
                  Opiniones reales
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#1C1C1E]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Nuestros clientes
                </h2>
                <p className="text-[#777] text-sm mt-2">Confían en nosotros</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t) => (
                  <div key={t.id} className="border border-[#e8e4df] p-8 hover:border-[#C9A96E]/40 transition-colors duration-300 relative">
                    {/* Quote */}
                    <div className="absolute top-6 right-8 text-6xl text-[#C9A96E]/10 font-serif leading-none">&ldquo;</div>
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-base ${i < t.rating ? "text-[#C9A96E]" : "text-[#ddd]"}`}>★</span>
                      ))}
                    </div>
                    <p className="text-[#444] text-sm leading-relaxed mb-6 relative z-10">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e8e4df] flex items-center justify-center text-[#8B7355] font-bold text-sm">
                        {t.clientName.charAt(0)}
                      </div>
                      <p className="text-[#8B7355] font-semibold text-sm uppercase tracking-wide">{t.clientName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ── CTA final ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#1C1C1E]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A96E] mb-4">
            Hablemos
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            ¿Tenés un proyecto<br />en mente?
          </h2>
          <p className="text-white/50 mb-10 text-sm leading-relaxed max-w-md mx-auto">
            Contactanos y te asesoramos sin costo. Respondemos rápido por WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={waUrl}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#C9A96E] hover:bg-[#b8965e] text-[#1C1C1E] font-semibold text-xs uppercase tracking-widest px-10 py-4 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white text-xs uppercase tracking-widest px-10 py-4 hover:bg-white/5 transition-all duration-300"
            >
              Formulario de contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
