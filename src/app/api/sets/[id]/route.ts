import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const set = await prisma.productSet.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: { select: { id: true, name: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });
  if (!set) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(set);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, description, categoryId, imageUrl, imagePublicId, isActive, isFeatured, addProductId, removeItemId } = body;

  // Add a product to the set
  if (addProductId) {
    const existing = await prisma.productSetItem.findFirst({
      where: { setId: parseInt(id), productId: addProductId },
    });
    if (existing) return NextResponse.json({ error: "El producto ya está en el set" }, { status: 400 });
    await prisma.productSetItem.create({
      data: { setId: parseInt(id), productId: addProductId, quantity: 1 },
    });
    return NextResponse.json({ success: true });
  }

  // Remove a product from the set
  if (removeItemId) {
    await prisma.productSetItem.delete({ where: { id: removeItemId } });
    return NextResponse.json({ success: true });
  }

  // Update set metadata
  const data: Record<string, unknown> = {};
  if (name !== undefined) { data.name = name; data.slug = slugify(name); }
  if (description !== undefined) data.description = description || null;
  if (categoryId !== undefined) data.categoryId = categoryId ? parseInt(categoryId) : null;
  if (imageUrl !== undefined) data.imageUrl = imageUrl || null;
  if (imagePublicId !== undefined) data.imagePublicId = imagePublicId || null;
  if (isActive !== undefined) data.isActive = isActive;
  if (isFeatured !== undefined) data.isFeatured = isFeatured;

  const set = await prisma.productSet.update({ where: { id: parseInt(id) }, data });
  return NextResponse.json(set);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.productSet.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
