import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muebles Fercho — Muebles a Medida",
    short_name: "Muebles Fercho",
    description:
      "Fabricamos muebles de madera, melamina y MDF a medida. Calidad artesanal, precios accesibles.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F7",
    theme_color: "#1C1C1E",
    orientation: "portrait-primary",
    categories: ["shopping", "lifestyle"],
    lang: "es",
    dir: "ltr",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
