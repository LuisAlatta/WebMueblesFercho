import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/catalog/GoogleAnalytics";
import { getSiteUrl } from "@/lib/siteUrl";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["700"],
});

export const viewport: Viewport = {
  themeColor: "#1C1C1E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Muebles Fercho — Muebles a Medida",
    template: "%s | Muebles Fercho",
  },
  description:
    "Fabricamos muebles de madera, melamina y MDF a medida. Calidad artesanal, precios accesibles. Contactanos por WhatsApp.",
  metadataBase: new URL(getSiteUrl()),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Muebles Fercho",
  },
  icons: {
    icon: [
      { url: "/images/favicon fercho.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/favicon fercho.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://bruxqwwypotsdghsxowo.supabase.co" />
        <link rel="dns-prefetch" href="https://bruxqwwypotsdghsxowo.supabase.co" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-[var(--font-sans)]">
        <GoogleAnalytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
