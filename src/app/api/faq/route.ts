import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { question, answer, order } = await req.json();
  if (!question || !answer) return NextResponse.json({ error: "Pregunta y respuesta requeridas" }, { status: 400 });

  const faq = await prisma.faq.create({ data: { question, answer, order: order ?? 0 } });
  return NextResponse.json(faq, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, ...data } = await req.json();
  const faq = await prisma.faq.update({ where: { id }, data });
  return NextResponse.json(faq);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await req.json();
  await prisma.faq.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
