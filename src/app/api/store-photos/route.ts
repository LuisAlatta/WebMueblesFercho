import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  const photos = await prisma.storeDirectionPhoto.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { url, path, caption, order } = body;
  if (!url || !path) return NextResponse.json({ error: "url y path requeridos" }, { status: 400 });

  const count = await prisma.storeDirectionPhoto.count();
  const photo = await prisma.storeDirectionPhoto.create({
    data: { url, path, caption: caption ?? null, order: order ?? count },
  });

  revalidatePath("/", "layout");
  return NextResponse.json(photo);
}
