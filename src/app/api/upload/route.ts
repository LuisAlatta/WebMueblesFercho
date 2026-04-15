import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/supabase-storage";
import sharp from "sharp";

function detectFormat(buf: Buffer): "jpeg" | "png" | "webp" | "gif" | "heic" | "unknown" {
  if (buf.length < 12) return "unknown";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf.slice(0, 4).toString() === "RIFF" && buf.slice(8, 12).toString() === "WEBP") return "webp";
  if (buf.slice(0, 3).toString() === "GIF") return "gif";
  if (buf.slice(4, 8).toString() === "ftyp") {
    const brand = buf.slice(8, 12).toString();
    if (["heic", "heix", "hevc", "mif1", "msf1", "heis"].includes(brand)) return "heic";
  }
  return "unknown";
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string | null) ?? "productos";

  if (!file) return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });

  let buffer = Buffer.from(await file.arrayBuffer());
  let fileName = file.name;
  let mimeType = file.type;

  const format = detectFormat(buffer);

  if (format === "heic") {
    try {
      buffer = Buffer.from(await sharp(buffer).jpeg({ quality: 85 }).toBuffer());
      fileName = fileName.replace(/\.[^.]+$/, "") + ".jpg";
      mimeType = "image/jpeg";
    } catch {
      return NextResponse.json(
        { error: "Formato HEIC no soportado. Convertí la imagen a JPG/PNG antes de subir (en iPhone: Ajustes → Cámara → Formatos → Más compatible)." },
        { status: 400 }
      );
    }
  } else if (format === "unknown") {
    return NextResponse.json({ error: "Formato no soportado. Usá JPG, PNG o WebP." }, { status: 400 });
  }

  const { url, path } = await uploadImage(buffer, fileName, mimeType, folder);

  return NextResponse.json({ url, path });
}
