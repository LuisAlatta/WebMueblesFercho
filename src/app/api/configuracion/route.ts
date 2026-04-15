import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  let config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  if (!config) {
    config = await prisma.siteConfig.create({
      data: { id: 1, businessName: "Muebles Fercho" },
    });
  }
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const config = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: body,
    create: { id: 1, ...body },
  });
  revalidatePath("/", "layout");
  return NextResponse.json(config);
}
