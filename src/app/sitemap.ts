import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/siteUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
  ]);

  const static_routes = [
    { url: base, priority: 1.0 },
    { url: `${base}/catalogo`, priority: 0.9 },
    { url: `${base}/galeria`, priority: 0.7 },
    { url: `${base}/como-trabajamos`, priority: 0.6 },
    { url: `${base}/nosotros`, priority: 0.6 },
    { url: `${base}/faq`, priority: 0.5 },
    { url: `${base}/contacto`, priority: 0.6 },
  ];

  const product_routes = products.map((p) => ({
    url: `${base}/producto/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.8,
  }));

  const category_routes = categories.map((c) => ({
    url: `${base}/categoria/${c.slug}`,
    priority: 0.7,
  }));

  return [...static_routes, ...product_routes, ...category_routes];
}
