import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { categoryId, products } = body as {
    categoryId: number;
    products: { name: string; url: string; publicId: string }[];
  };

  if (!categoryId || !Array.isArray(products) || products.length === 0) {
    return NextResponse.json(
      { error: "categoryId y products[] son requeridos" },
      { status: 400 }
    );
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  }

  // Get existing slugs to avoid collisions
  const existingSlugs = new Set(
    (await prisma.product.findMany({ select: { slug: true } })).map((p) => p.slug)
  );

  function uniqueSlug(name: string): string {
    let base = slugify(name);
    if (!base) base = "producto";
    let slug = base;
    let i = 2;
    while (existingSlugs.has(slug)) {
      slug = `${base}-${i}`;
      i++;
    }
    existingSlugs.add(slug);
    return slug;
  }

  const created: string[] = [];
  const errors: string[] = [];

  // Process in transaction batches of 20 to avoid timeout
  const BATCH = 20;
  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH);
    try {
      await prisma.$transaction(
        batch.map((p) => {
          const slug = uniqueSlug(p.name);
          return prisma.product.create({
            data: {
              name: p.name,
              slug,
              categoryId,
              isActive: true,
              images: {
                create: { url: p.url, publicId: p.publicId, order: 0 },
              },
            },
          });
        })
      );
      created.push(...batch.map((p) => p.name));
    } catch (err) {
      errors.push(
        ...batch.map((p) => `${p.name}: ${err instanceof Error ? err.message : "Error desconocido"}`)
      );
    }
  }

  return NextResponse.json({ created: created.length, errors });
}
