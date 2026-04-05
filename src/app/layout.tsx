import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/catalog/GoogleAnalytics";
import { getSiteUrl } from "@/lib/siteUrl";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Muebles Fercho — Muebles a Medida",
    template: "%s | Muebles Fercho",
  },
  description:
    "Fabricamos muebles de madera, melamina y MDF a medida. Calidad artesanal, precios accesibles. Contactanos por WhatsApp.",
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-[var(--font-outfit)]">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
