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
    <footer className="bg-[#1C1C1E] text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Marca */}
        <div>
          <h3
            className="text-white text-lg font-bold mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {name}
          </h3>
          <p className="text-sm leading-relaxed text-white/60">
            Fabricamos muebles a medida con madera, melamina y MDF. Calidad artesanal para tu hogar.
          </p>
          {/* Redes */}
          <div className="flex gap-3 mt-4">
            {config?.instagram && (
              <a href={`https://instagram.com/${config.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A96E] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {config?.facebook && (
              <a href={`https://facebook.com/${config.facebook}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A96E] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {wa && (
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A96E] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Catálogo</h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/catalogo", label: "Todos los productos" },
              { href: "/galeria", label: "Galería de trabajos" },
              { href: "/como-trabajamos", label: "Cómo trabajamos" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/faq", label: "Preguntas frecuentes" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[#C9A96E] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Contacto</h4>
          <ul className="space-y-2 text-sm">
            {config?.phone && <li>{config.phone}</li>}
            {config?.email && <li>{config.email}</li>}
            {config?.address && <li className="text-white/60">{config.address}</li>}
            {wa && (
              <li>
                <a
                  href={`https://wa.me/${wa}?text=${encodeURIComponent("Hola! Quisiera información sobre sus muebles.")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-full transition-colors mt-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Escribinos por WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {year} {name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
