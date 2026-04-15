import { MapPin, ExternalLink, Navigation } from "lucide-react";
import StoreLocationGallery from "./StoreLocationGallery";

interface Photo {
  id: number;
  url: string;
  caption: string | null;
}

interface Config {
  businessName?: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface Props {
  config: Config | null;
  photos: Photo[];
}

export default function StoreLocation({ config, photos }: Props) {
  const lat = config?.latitude;
  const lng = config?.longitude;

  if (lat == null || lng == null) return null;

  const embedSrc = `https://www.google.com/maps?q=${lat},${lng}&z=17&hl=es&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const dirLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section className="bg-[#1C1C1E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-8">
          <span className="block text-[10px] text-[#C9A96E] uppercase tracking-[0.2em] font-medium mb-2">
            Visítanos
          </span>
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ven a nuestra tienda
          </h2>
          {config?.address && (
            <p className="text-sm text-white/60 mt-3 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-[#C9A96E]" />
              {config.address}
            </p>
          )}
        </div>

        {/* Map */}
        <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <iframe
            src={embedSrc}
            width="100%"
            height="420"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            title="Ubicación de la tienda"
            className="block w-full h-[320px] sm:h-[420px]"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#C9A96E] hover:bg-[#b8975e] text-[#1C1C1E] text-sm font-semibold px-5 py-3 rounded-full transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir en Google Maps
          </a>
          <a
            href={dirLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium px-5 py-3 rounded-full transition-colors border border-white/15"
          >
            <Navigation className="w-4 h-4" />
            Cómo llegar
          </a>
        </div>

        {/* Gallery */}
        {photos.length > 0 && (
          <div className="mt-12">
            <div className="text-center mb-6">
              <span className="block text-[10px] text-[#C9A96E] uppercase tracking-[0.2em] font-medium mb-2">
                Referencias
              </span>
              <h3
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Cómo llegar a la tienda
              </h3>
              <p className="text-sm text-white/50 mt-2">
                Fotos de referencia del camino y la fachada
              </p>
            </div>
            <StoreLocationGallery photos={photos} />
          </div>
        )}
      </div>
    </section>
  );
}
