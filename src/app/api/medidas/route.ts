import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const measurements = await prisma.measurement.findMany({ orderBy: { label: "asc" } });
  return NextResponse.json(measurements);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { label, description } = await req.json();
  if (!label) return NextResponse.json({ error: "La etiqueta es requerida" }, { status: 400 });

  const measurement = await prisma.measurement.create({ data: { label, description } });
  return NextResponse.json(measurement, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await req.json();
  await prisma.measurement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
