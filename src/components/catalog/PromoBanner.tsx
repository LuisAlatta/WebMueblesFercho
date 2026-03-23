"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function PromoBanner({ text }: { text: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-[#C9A96E] text-[#1C1C1E] text-sm py-2 px-4 text-center font-medium relative">
      {text}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
