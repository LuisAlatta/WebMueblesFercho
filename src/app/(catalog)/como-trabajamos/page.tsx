import { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = { title: "Cómo trabajamos" };

const steps = [
  {
    n: "01", title: "Nos contactás",
    desc: "Escribinos por WhatsApp o completá el formulario de contacto con lo que tenés en mente: qué mueble necesitás, en qué espacio va, y si tenés medidas.",
    detail: "Respondemos en menos de 24hs hábiles.",
  },
  {
    n: "02", title: "Cotizamos juntos",
    desc: "Te enviamos un presupuesto detallado con material, medidas, terminaciones y precio final. Sin sorpresas.",
    detail: "El presupuesto no tiene costo.",
  },
  {
    n: "03", title: "Fabricamos tu mueble",
    desc: "Una vez confirmado el pedido, comenzamos la fabricación. Te vamos informando el avance.",
    detail: "Tiempo estimado: 10 a 20 días hábiles según la complejidad.",
  },
  {
    n: "04", title: "Entregamos e instalamos",
    desc: "Coordinamos la entrega a tu domicilio e instalamos el mueble en su lugar definitivo.",
    detail: "Disponible en zona de cobertura. Consultá tu ubicación.",
  },
];

export default function ComoTrabajamosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-16">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1C1C1E]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Cómo trabajamos
        </h1>
        <p className="text-[#7A7A7A] mt-3 max-w-xl mx-auto">
          Un proceso simple, claro y sin sorpresas. Desde tu idea hasta el mueble en tu casa.
        </p>
      </div>

      <div className="space-y-6 mb-16">
        {steps.map((step, i) => (
          <div key={step.n} className="flex gap-6 items-start">
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#C9A96E] text-[#1C1C1E] font-bold text-lg flex items-center justify-center">
                {step.n}
              </div>
              {i < steps.length - 1 && (
                <div className="w-px h-12 bg-[#C9A96E]/30 mx-auto mt-1" />
              )}
            </div>
            <div className="pb-4">
              <h3
                className="text-xl font-bold text-[#1C1C1E] mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {step.title}
              </h3>
              <p className="text-[#2C2C2C] leading-relaxed mb-2">{step.desc}</p>
              <p className="text-sm text-[#8B7355] font-medium">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#FAF9F7] rounded-2xl p-8 text-center">
        <h2
          className="text-xl font-bold text-[#1C1C1E] mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          ¿Listo para empezar?
        </h2>
        <p className="text-[#7A7A7A] mb-6">Contactanos ahora y en menos de 24hs te respondemos.</p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola! Quisiera cotizar un mueble.")}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Empezar por WhatsApp
        </a>
      </div>
    </div>
  );
}
