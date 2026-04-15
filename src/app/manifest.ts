import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muebles Fercho Admin",
    short_name: "Fercho Admin",
    description: "Panel de administración de Muebles Fercho",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    background_color: "#1C1C1E",
    theme_color: "#1C1C1E",
    orientation: "portrait-primary",
    categories: ["business", "productivity"],
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
    shortcuts: [
      {
        name: "Productos",
        url: "/admin/productos",
      },
      {
        name: "Configuración",
        url: "/admin/configuracion",
      },
    ],
  };
}
