import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteStorageImage } from "@/lib/supabase-storage";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const data: { caption?: string | null; order?: number } = {};
  if ("caption" in body) data.caption = body.caption;
  if ("order" in body) data.order = body.order;

  const photo = await prisma.storeDirectionPhoto.update({
    where: { id: Number(id) },
    data,
  });
  revalidatePath("/", "layout");
  return NextResponse.json(photo);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const photo = await prisma.storeDirectionPhoto.findUnique({ where: { id: Number(id) } });
  if (!photo) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  await prisma.storeDirectionPhoto.delete({ where: { id: Number(id) } });
  await deleteStorageImage(photo.path).catch(() => {});

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
