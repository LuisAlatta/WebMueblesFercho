import { Metadata } from "next";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = { title: "Nosotros" };

export default function NosotrosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2
            className="text-2xl font-bold text-[#1C1C1E] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Nuestra historia
          </h2>
          <div className="space-y-4 text-[#2C2C2C] leading-relaxed">
            <p>
              Muebles Fercho nació de la pasión por la carpintería y el deseo de brindar
              muebles de calidad que se adapten a cada hogar y cada presupuesto.
            </p>
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
        <div className="bg-[#FAF9F7] rounded-2xl p-8">
          <h3 className="font-semibold text-[#1C1C1E] mb-5">Nuestros valores</h3>
          <ul className="space-y-3">
            {[
              "Calidad artesanal en cada pieza",
              "Materiales seleccionados y duraderos",
              "Precios transparentes y accesibles",
              "Atención personalizada",
              "Cumplimiento de plazos",
              "Garantía en todos nuestros productos",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-[#2C2C2C]">
                <CheckCircle className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 text-center bg-[#1C1C1E] rounded-2xl p-8 text-white">
        {[
          { number: "500+", label: "Clientes satisfechos" },
          { number: "10+", label: "Años de experiencia" },
          { number: "1000+", label: "Muebles fabricados" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold text-[#C9A96E]" style={{ fontFamily: "var(--font-playfair)" }}>
              {stat.number}
            </p>
            <p className="text-white/70 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
