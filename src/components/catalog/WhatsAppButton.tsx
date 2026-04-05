"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const url = buildSimpleWhatsAppUrl();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        // Show when scrolling up or near top, hide when scrolling down
        if (currentY < 100) {
          setVisible(true);
        } else if (currentY < lastScrollY.current - 5) {
          setVisible(true);
        } else if (currentY > lastScrollY.current + 5) {
          setVisible(false);
        }
        lastScrollY.current = currentY;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1fba59] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
      aria-label="Contactar por WhatsApp"
    >
      {/* Icon only on mobile, with text on desktop */}
      <span className="flex items-center justify-center w-14 h-14 md:hidden">
        <MessageCircle className="w-7 h-7 fill-white" />
      </span>
      <span className="hidden md:flex items-center gap-2 px-5 py-3.5 text-sm font-semibold">
        <MessageCircle className="w-5 h-5 fill-white" />
        WhatsApp
      </span>
    </a>
  );
}
