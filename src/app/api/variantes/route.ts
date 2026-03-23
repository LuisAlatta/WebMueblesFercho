import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productoId = searchParams.get("productoId");
  if (!productoId) return NextResponse.json({ error: "productoId requerido" }, { status: 400 });

  const variants = await prisma.variant.findMany({
    where: { productId: parseInt(productoId) },
    include: {
      material: true,
      measurement: true,
      priceHistory: { orderBy: { changedAt: "desc" }, take: 10 },
    },
  });
  return NextResponse.json(variants);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { productId, materialId, measurementId, price, sku, stock } = await req.json();
  if (!productId || price === undefined) {
    return NextResponse.json({ error: "productId y price son requeridos" }, { status: 400 });
  }

  const variant = await prisma.variant.create({
    data: {
      productId,
      materialId: materialId || null,
      measurementId: measurementId || null,
      price,
      sku: sku || null,
      stock: stock ?? null,
    },
    include: { material: true, measurement: true },
  });
  return NextResponse.json(variant, { status: 201 });
}
