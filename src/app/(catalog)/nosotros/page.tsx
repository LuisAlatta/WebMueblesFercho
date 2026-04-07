import { Metadata } from "next";
import { CheckCircle, Hammer, TreePine, Award } from "lucide-react";

export const metadata: Metadata = { title: "Nosotros" };

const stats = [
  { number: "500+", label: "Clientes satisfechos", icon: Award },
  { number: "10+", label: "Años de experiencia", icon: Hammer },
  { number: "1000+", label: "Muebles fabricados", icon: TreePine },
];

const values = [
  "Calidad artesanal en cada pieza",
  "Materiales seleccionados y duraderos",
  "Precios transparentes y accesibles",
  "Atención personalizada",
  "Cumplimiento de plazos",
  "Garantía en todos nuestros productos",
];

const timeline = [
  { year: "Inicio", text: "Nace Muebles Fercho como un pequeño taller familiar con pasión por la carpintería." },
  { year: "Crecimiento", text: "Incorporamos melamina y MDF, ampliando nuestra oferta y llegando a más hogares." },
  { year: "Hoy", text: "Más de 500 clientes confían en nosotros para fabricar muebles a medida de calidad." },
];

export default function NosotrosPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center mb-12">
        <p className="text-[10px] text-[#C9A96E] uppercase tracking-[0.3em] font-semibold mb-2">Quiénes somos</p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1C1C1E]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Nosotros
        </h1>
        <p className="text-[#7A7A7A] mt-3 max-w-xl mx-auto">
          Somos una carpintería familiar con años de experiencia fabricando muebles a medida.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center bg-[#FAF9F7] rounded-2xl p-5 sm:p-8">
            <stat.icon className="w-6 h-6 text-[#C9A96E] mx-auto mb-3" />
            <p className="text-2xl sm:text-3xl font-bold text-[#1C1C1E]" style={{ fontFamily: "var(--font-playfair)" }}>
              {stat.number}
            </p>
            <p className="text-[#7A7A7A] text-xs sm:text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-14">
        {/* Timeline */}
        <div>
          <h2
            className="text-2xl font-bold text-[#1C1C1E] mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Nuestra historia
          </h2>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#C9A96E] shrink-0 mt-1.5" />
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-[#C9A96E]/20" />}
                </div>
                <div className="pb-8">
                  <p className="text-xs font-semibold text-[#C9A96E] uppercase tracking-wider mb-1">{item.year}</p>
                  <p className="text-sm text-[#2C2C2C] leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-4 text-sm text-[#2C2C2C] leading-relaxed">
            <p>
              Trabajamos con madera maciza, MDF y melamina, seleccionando los mejores
              materiales para garantizar durabilidad y estética en cada pieza.
            </p>
            <p>
              Cada mueble que fabricamos es único, diseñado y construido según las
              necesidades exactas de nuestros clientes.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-[#1C1C1E] rounded-2xl p-8 text-white">
          <h3 className="font-semibold mb-5 text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
            Nuestros valores
          </h3>
          <ul className="space-y-4">
            {values.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                <CheckCircle className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
