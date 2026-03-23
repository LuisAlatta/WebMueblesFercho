import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import FaqAccordion from "@/components/catalog/FaqAccordion";

export const metadata: Metadata = { title: "Preguntas frecuentes" };
export const revalidate = 60;

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1C1C1E]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Preguntas frecuentes
        </h1>
        <p className="text-[#7A7A7A] mt-3">
          Todo lo que necesitás saber antes de hacer tu pedido.
        </p>
      </div>
      <FaqAccordion faqs={faqs} />
    </div>
  );
}
