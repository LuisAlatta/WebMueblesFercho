"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Faq { id: number; question: string; answer: string; }

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (faqs.length === 0) {
    return <p className="text-center text-[#7A7A7A]">No hay preguntas frecuentes todavía.</p>;
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <div key={faq.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setOpen(open === faq.id ? null : faq.id)}
            className="w-full flex items-center justify-between px-6 py-4 text-left"
          >
            <span className="font-medium text-[#1C1C1E] text-sm pr-4">{faq.question}</span>
            <ChevronDown
              className={cn("w-4 h-4 text-[#8B7355] shrink-0 transition-transform duration-200", open === faq.id && "rotate-180")}
            />
          </button>
          {open === faq.id && (
            <div className="px-6 pb-5 text-sm text-[#7A7A7A] leading-relaxed border-t border-gray-50 pt-3">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
