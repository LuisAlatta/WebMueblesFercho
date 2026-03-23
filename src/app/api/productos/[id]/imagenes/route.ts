import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const images = await prisma.productImage.findMany({
    where: { productId: parseInt(id) },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const { url, publicId } = await req.json();
  if (!url || !publicId) return NextResponse.json({ error: "url y publicId requeridos" }, { status: 400 });

  const count = await prisma.productImage.count({ where: { productId: parseInt(id) } });

  const image = await prisma.productImage.create({
    data: { productId: parseInt(id), url, publicId, order: count },
  });
  return NextResponse.json(image, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  // Reorder: receives array of { id, order }
  const { images } = await req.json() as { images: { id: number; order: number }[] };
  await Promise.all(
    images.map((img) => prisma.productImage.update({ where: { id: img.id }, data: { order: img.order } }))
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, publicId } = await req.json();
  await prisma.productImage.delete({ where: { id } });
  if (publicId) await deleteImage(publicId).catch(() => {});
  return NextResponse.json({ success: true });
}
