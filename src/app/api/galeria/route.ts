import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const photos = await prisma.galleryPhoto.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { url, publicId, title, description, order } = await req.json();
  if (!url || !publicId) return NextResponse.json({ error: "url y publicId requeridos" }, { status: 400 });

  const photo = await prisma.galleryPhoto.create({
    data: { url, publicId, title, description, order: order ?? 0 },
  });
  return NextResponse.json(photo, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, ...data } = await req.json();
  const photo = await prisma.galleryPhoto.update({ where: { id }, data });
  return NextResponse.json(photo);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await req.json();
  await prisma.galleryPhoto.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
