import Link from "next/link";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

interface Config {
  businessName: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
}

export default function Footer({ config }: { config: Config | null }) {
  const year = new Date().getFullYear();
  const name = config?.businessName ?? "Muebles Fercho";
  const wa = config?.whatsapp;

  return (
    <footer className="bg-[#1C1C1E] text-white">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-10 sm:py-14">
        {/* Mobile: compact layout */}
        <div className="sm:hidden text-center">
          <span
            className="block text-xl font-bold mb-0.5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {name}
          </span>
          <span className="block text-[10px] text-[#C9A96E] uppercase tracking-[0.2em] font-medium mb-4">
            Fabricación a medida
          </span>
          {/* Social icons */}
          <div className="flex justify-center gap-5 mb-5">
            {config?.instagram && (
              <a href={`https://instagram.com/${config.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/50 hover:text-[#C9A96E] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {config?.facebook && (
              <a href={`https://facebook.com/${config.facebook}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/50 hover:text-[#C9A96E] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {wa && (
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-white/50 hover:text-[#C9A96E] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            )}
          </div>
          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-6 py-3 rounded-full mb-4 hover:bg-[#1fba59] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              WhatsApp
            </a>
          )}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-white/40">
            <Link href="/catalogo" className="hover:text-white/70 transition-colors">Catálogo</Link>
            <Link href="/nosotros" className="hover:text-white/70 transition-colors">Nosotros</Link>
            <Link href="/galeria" className="hover:text-white/70 transition-colors">Galería</Link>
            <Link href="/contacto" className="hover:text-white/70 transition-colors">Contacto</Link>
            <Link href="/faq" className="hover:text-white/70 transition-colors">FAQ</Link>
          </div>
        </div>

        {/* Desktop: 3-column layout */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-10">
          {/* Col 1: Branding */}
          <div>
            <span
              className="block text-xl font-bold mb-1 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {name}
            </span>
            <span className="block text-[10px] text-[#C9A96E] uppercase tracking-[0.2em] font-medium mb-4">
              Fabricación a medida
            </span>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Mobiliario a medida para tu hogar y empresa.
            </p>
            <div className="flex gap-4 mt-5">
              {config?.instagram && (
                <a href={`https://instagram.com/${config.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/40 hover:text-[#C9A96E] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {config?.facebook && (
                <a href={`https://facebook.com/${config.facebook}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/40 hover:text-[#C9A96E] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {wa && (
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-white/40 hover:text-[#C9A96E] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-5">
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Inicio" },
                { href: "/catalogo", label: "Catálogo" },
                { href: "/galeria", label: "Galería" },
                { href: "/como-trabajamos", label: "Cómo trabajamos" },
                { href: "/nosotros", label: "Nosotros" },
                { href: "/faq", label: "Preguntas frecuentes" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/40 hover:text-[#C9A96E] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-5">
              Contacto
            </h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              {config?.phone && (
                <li>
                  <a href={`tel:${config.phone}`} className="hover:text-[#C9A96E] transition-colors">
                    {config.phone}
                  </a>
                </li>
              )}
              {wa && (
                <li>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A96E] transition-colors">
                    {wa}
                  </a>
                </li>
              )}
              {config?.email && (
                <li>
                  <a href={`mailto:${config.email}`} className="hover:text-[#C9A96E] transition-colors">
                    {config.email}
                  </a>
                </li>
              )}
              {config?.address && (
                <li className="leading-relaxed text-white/30">{config.address}</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/30">
        © {year} {name} — Todos los derechos reservados.
      </div>
    </footer>
  );
}
