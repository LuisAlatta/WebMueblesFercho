import { unstable_cache } from "next/cache";
import Navbar from "@/components/catalog/Navbar";
import Footer from "@/components/catalog/Footer";
import WhatsAppButton from "@/components/catalog/WhatsAppButton";
import PromoBanner from "@/components/catalog/PromoBanner";
import { prisma } from "@/lib/prisma";

const getSiteConfig = unstable_cache(
  () => prisma.siteConfig.findUnique({ where: { id: 1 } }),
  ["site-config"],
  { revalidate: 3600 }
);

export default async function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();

  return (
    <div className="flex flex-col min-h-screen">
      {config?.promoBannerActive && config.promoBannerText && (
        <PromoBanner text={config.promoBannerText} />
      )}
      <Navbar businessName={config?.businessName ?? "Muebles Fercho"} />
      <main className="flex-1">{children}</main>
      <Footer config={config} />
      <WhatsAppButton />
    </div>
  );
}
