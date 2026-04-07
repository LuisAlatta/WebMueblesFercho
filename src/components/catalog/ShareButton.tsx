"use client";

import { useState, useCallback } from "react";
import { Share2, Check } from "lucide-react";

interface Props {
  title: string;
  text?: string;
}

export default function ShareButton({ title, text }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: text || title, url });
        return;
      } catch {}
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [title, text]);

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#1C1C1E] transition-colors"
      aria-label="Compartir"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-green-500 text-xs">Link copiado</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span className="text-xs">Compartir</span>
        </>
      )}
    </button>
  );
}
