/**
 * Script de carga masiva de productos.
 *
 * Uso:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/bulk-upload.ts ./fotos-cliente
 *
 * Estructura esperada:
 *   ./fotos-cliente/
 *     Sillas/
 *       silla-moderna.jpg      -> Producto "Silla Moderna" en categoría "Sillas"
 *       silla-rustica.png      -> Producto "Silla Rustica" en categoría "Sillas"
 *     Mesas/
 *       mesa-comedor.jpg       -> Producto "Mesa Comedor" en categoría "Mesas"
 *
 * Cada subcarpeta = categoría (se crea si no existe).
 * Cada imagen = producto nuevo con 1 foto.
 * El nombre del producto se genera a partir del nombre del archivo.
 */

import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

// --------------- Config ---------------

const BUCKET = "imagenes";
const UPLOAD_FOLDER = "productos";
const CONCURRENCY = 4;
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

// --------------- Init ---------------

const prisma = new PrismaClient();

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY");
    console.error("Asegurate de tener un archivo .env en la raiz del proyecto.");
    process.exit(1);
  }
  return createClient(url, key);
}

const supabase = getSupabase();

// --------------- Helpers ---------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function fileNameToProductName(fileName: string): string {
  const name = path.parse(fileName).name;
  return name
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
  };
  return map[ext] || "application/octet-stream";
}

const existingSlugs = new Set<string>();

function uniqueSlug(name: string): string {
  let base = slugify(name);
  if (!base) base = "producto";
  let slug = base;
  let i = 2;
  while (existingSlugs.has(slug)) {
    slug = `${base}-${i}`;
    i++;
  }
  existingSlugs.add(slug);
  return slug;
}

async function uploadFile(
  filePath: string,
  fileName: string
): Promise<{ url: string; storagePath: string }> {
  const ext = path.extname(fileName).toLowerCase();
  const buffer = fs.readFileSync(filePath);
  const storagePath = `${UPLOAD_FOLDER}/${Date.now()}-${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: getMimeType(ext), upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return { url: data.publicUrl, storagePath };
}

/** Run promises with limited concurrency */
async function pool<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
  const results: T[] = [];
  let i = 0;

  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker()));
  return results;
}

// --------------- Main ---------------

async function main() {
  const rootDir = process.argv[2];

  if (!rootDir) {
    console.log("Uso: npx ts-node --compiler-options '{\"module\":\"CommonJS\"}' scripts/bulk-upload.ts <carpeta>");
    console.log("");
    console.log("Estructura esperada:");
    console.log("  <carpeta>/");
    console.log("    NombreCategoria/");
    console.log("      imagen-producto.jpg");
    process.exit(1);
  }

  const absRoot = path.resolve(rootDir);
  if (!fs.existsSync(absRoot) || !fs.statSync(absRoot).isDirectory()) {
    console.error(`Error: "${absRoot}" no existe o no es una carpeta.`);
    process.exit(1);
  }

  // Load existing slugs
  const allProducts = await prisma.product.findMany({ select: { slug: true } });
  allProducts.forEach((p) => existingSlugs.add(p.slug));

  // Read category folders
  const categoryDirs = fs
    .readdirSync(absRoot)
    .filter((name) => fs.statSync(path.join(absRoot, name)).isDirectory());

  if (categoryDirs.length === 0) {
    console.error("No se encontraron subcarpetas (categorias) dentro de:", absRoot);
    process.exit(1);
  }

  console.log(`\nCarpetas encontradas: ${categoryDirs.join(", ")}\n`);

  let totalCreated = 0;
  let totalErrors = 0;

  for (const catDir of categoryDirs) {
    const catPath = path.join(absRoot, catDir);
    const catName = catDir.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const catSlug = slugify(catDir);

    // Find or create category
    let category = await prisma.category.findUnique({ where: { slug: catSlug } });
    if (!category) {
      category = await prisma.category.create({
        data: { name: catName, slug: catSlug, isActive: true },
      });
      console.log(`+ Categoria creada: "${catName}"`);
    } else {
      console.log(`= Categoria existente: "${category.name}"`);
    }

    // List image files
    const files = fs
      .readdirSync(catPath)
      .filter((f) => {
        const ext = path.extname(f).toLowerCase();
        return IMAGE_EXTENSIONS.has(ext) && fs.statSync(path.join(catPath, f)).isFile();
      });

    if (files.length === 0) {
      console.log(`  (sin imagenes, saltando)\n`);
      continue;
    }

    console.log(`  ${files.length} imagen(es) a procesar...`);

    let created = 0;
    let errors = 0;

    const tasks = files.map((file, idx) => async () => {
      const productName = fileNameToProductName(file);
      const slug = uniqueSlug(productName);

      try {
        const { url, storagePath } = await uploadFile(path.join(catPath, file), file);

        await prisma.product.create({
          data: {
            name: productName,
            slug,
            categoryId: category!.id,
            isActive: true,
            images: {
              create: { url, publicId: storagePath, order: 0 },
            },
          },
        });

        created++;
        const progress = `[${idx + 1}/${files.length}]`;
        console.log(`  ${progress} ✓ ${productName}`);
      } catch (err) {
        errors++;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`  [${idx + 1}/${files.length}] ✗ ${productName}: ${msg}`);
      }
    });

    await pool(tasks, CONCURRENCY);

    totalCreated += created;
    totalErrors += errors;
    console.log(`  Resultado: ${created} creados, ${errors} errores\n`);
  }

  console.log("═══════════════════════════════════");
  console.log(`Total: ${totalCreated} productos creados, ${totalErrors} errores`);
  console.log("═══════════════════════════════════\n");

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
