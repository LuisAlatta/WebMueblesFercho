import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import Navbar from "@/components/catalog/Navbar";
import Footer from "@/components/catalog/Footer";
import WhatsAppButton from "@/components/catalog/WhatsAppButton";
import PromoBanner from "@/components/catalog/PromoBanner";
import { prisma } from "@/lib/prisma";
import { CatalogTypeProvider } from "@/components/catalog/CatalogTypeProvider";
import { CATALOG_TYPE_COOKIE, CatalogType } from "@/lib/catalogType";

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
  const cookieStore = await cookies();
  const catalogType = (cookieStore.get(CATALOG_TYPE_COOKIE)?.value || "min") as CatalogType;

  return (
    <CatalogTypeProvider initialType={catalogType}>
      <div className="flex flex-col min-h-screen">
        {config?.promoBannerActive && config.promoBannerText && (
          <PromoBanner text={config.promoBannerText} />
        )}
        <Navbar businessName={config?.businessName ?? "Muebles Fercho"} />
        <main className="flex-1">{children}</main>
        <Footer config={config} />
        <WhatsAppButton />
      </div>
    </CatalogTypeProvider>
  );
}
