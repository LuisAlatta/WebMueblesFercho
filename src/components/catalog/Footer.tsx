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
    <footer className="bg-white border-t border-gray-200">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* Col 1: Branding */}
        <div>
          <span
            className="block text-xl font-bold text-[#1C1C1E] mb-1 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {name}
          </span>
          <span className="block text-[10px] text-[#999] uppercase tracking-[0.2em] font-medium mb-4">
            Fabricación a medida
          </span>
          <p className="text-sm text-[#777] leading-relaxed max-w-xs">
            Arquitectura, diseño de interiores y mobiliario a medida para tu hogar y empresa.
          </p>
          {/* Social icons */}
          <div className="flex gap-4 mt-5">
            {config?.instagram && (
              <a
                href={`https://instagram.com/${config.instagram}`}
                target="_blank" rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#999] hover:text-[#C9A96E] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {config?.facebook && (
              <a
                href={`https://facebook.com/${config.facebook}`}
                target="_blank" rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#999] hover:text-[#C9A96E] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {wa && (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank" rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-[#999] hover:text-[#C9A96E] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1C1C1E] mb-5">
            Navegación
          </h4>
          <ul className="space-y-2.5">
            {[
              { href: "/", label: "Home" },
              { href: "/catalogo", label: "Catálogo" },
              { href: "/galeria", label: "Galería" },
              { href: "/como-trabajamos", label: "Cómo trabajamos" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/faq", label: "Preguntas frecuentes" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-[#777] hover:text-[#C9A96E] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Contact */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1C1C1E] mb-5">
            Contáctenos
          </h4>
          <ul className="space-y-2.5 text-sm text-[#777]">
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
              <li className="leading-relaxed text-[#999]">{config.address}</li>
            )}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 py-5 text-center text-xs text-[#aaa]">
        © {year} {name} — Todos los derechos reservados.
      </div>
    </footer>
  );
}
