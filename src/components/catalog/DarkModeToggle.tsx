"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("mf-theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("mf-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("mf-theme", "light");
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Modo claro" : "Modo oscuro"}
      className="p-2 text-white/75 hover:text-white transition-colors drop-shadow-sm"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
