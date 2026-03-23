import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { price, sku, stock, isActive } = body;

  const current = await prisma.variant.findUnique({ where: { id: parseInt(id) } });
  if (!current) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // Registrar historial si cambia el precio
  if (price !== undefined && Number(price) !== Number(current.price)) {
    await prisma.priceHistory.create({
      data: { variantId: parseInt(id), oldPrice: current.price, newPrice: price },
    });
  }

  const data: Record<string, unknown> = {};
  if (price !== undefined) data.price = price;
  if (sku !== undefined) data.sku = sku;
  if (stock !== undefined) data.stock = stock;
  if (isActive !== undefined) data.isActive = isActive;

  const variant = await prisma.variant.update({
    where: { id: parseInt(id) },
    data,
    include: { material: true, measurement: true },
  });
  return NextResponse.json(variant);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.variant.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
