import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      variants: {
        include: { material: true, measurement: true, priceHistory: { orderBy: { changedAt: "desc" }, take: 5 } },
      },
    },
  });
  if (!product) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const {
    name, description, categoryId, isFeatured, isActive,
    warrantyMonths, productionDays, order, images,
  } = body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) { data.name = name; data.slug = slugify(name); }
  if (description !== undefined) data.description = description;
  if (categoryId !== undefined) data.categoryId = categoryId;
  if (isFeatured !== undefined) data.isFeatured = isFeatured;
  if (isActive !== undefined) data.isActive = isActive;
  if (warrantyMonths !== undefined) data.warrantyMonths = warrantyMonths;
  if (productionDays !== undefined) data.productionDays = productionDays;
  if (order !== undefined) data.order = order;

  const product = await prisma.product.update({ where: { id: parseInt(id) }, data });

  // Reemplazar imágenes si se enviaron
  if (images !== undefined) {
    await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });
    if (images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((img: { url: string; publicId: string; altText?: string; order: number; isPrimary: boolean }, i: number) => ({
          productId: parseInt(id),
          url: img.url,
          publicId: img.publicId,
          altText: img.altText,
          order: i,
          isPrimary: i === 0,
        })),
      });
    }
  }

  return NextResponse.json(product);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
