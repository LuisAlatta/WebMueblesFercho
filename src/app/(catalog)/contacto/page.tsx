import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/catalog/ContactForm";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export const metadata: Metadata = { title: "Contacto" };
export const revalidate = 3600;

export default async function ContactoPage() {
  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  const wa = config?.whatsapp;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1C1C1E]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Contacto
        </h1>
        <p className="text-[#7A7A7A] mt-3">
          ¿Tenés un proyecto? Escribinos y te respondemos rápido.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Datos */}
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-[#1C1C1E] mb-4">Hablemos</h2>
            <ul className="space-y-4">
              {wa && (
                <li className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-[#C9A96E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">WhatsApp</p>
                    <a
                      href={`https://wa.me/${wa}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline"
                    >
                      Escribir ahora
                    </a>
                  </div>
                </li>
              )}
              {config?.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#C9A96E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">Teléfono</p>
                    <p className="text-sm text-[#7A7A7A]">{config.phone}</p>
                  </div>
                </li>
              )}
              {config?.email && (
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C9A96E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">Email</p>
                    <a href={`mailto:${config.email}`} className="text-sm text-[#7A7A7A] hover:text-[#1C1C1E]">
                      {config.email}
                    </a>
                  </div>
                </li>
              )}
              {config?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C9A96E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">Dirección</p>
                    <p className="text-sm text-[#7A7A7A]">{config.address}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {wa && (
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <p className="text-sm font-medium text-green-800 mb-1">Respuesta rápida</p>
              <p className="text-sm text-green-700 mb-3">
                La forma más rápida de contactarnos es por WhatsApp. Respondemos en minutos.
              </p>
              <a
                href={`https://wa.me/${wa}?text=${encodeURIComponent("Hola! Quisiera cotizar un mueble.")}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Escribir por WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Formulario */}
        <ContactForm whatsapp={wa} />
      </div>
    </div>
  );
}
