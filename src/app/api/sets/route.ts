import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const sets = await prisma.productSet.findMany({
    include: {
      category: { select: { name: true } },
      items: {
        include: { product: { select: { id: true, name: true } } },
      },
    },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(sets);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, description, categoryId, imageUrl, imagePublicId, isFeatured } = await req.json();
  if (!name) return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });

  const set = await prisma.productSet.create({
    data: {
      name,
      slug: slugify(name),
      description: description || null,
      categoryId: categoryId ? parseInt(categoryId) : null,
      imageUrl: imageUrl || null,
      imagePublicId: imagePublicId || null,
      isFeatured: isFeatured || false,
    },
  });
  return NextResponse.json(set, { status: 201 });
}
