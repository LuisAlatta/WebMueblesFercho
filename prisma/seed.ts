import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@mueblesfercho.com" },
    update: {},
    create: {
      email: "admin@mueblesfercho.com",
      password: hashedPassword,
      name: "Administrador",
    },
  });

  // Site config inicial
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      businessName: "Muebles Fercho",
      whatsapp: "5491112345678",
      promoBannerActive: false,
    },
  });

  // Categorias de ejemplo
  const categories = [
    { name: "Dormitorios", slug: "dormitorios", order: 1 },
    { name: "Livings", slug: "livings", order: 2 },
    { name: "Comedores", slug: "comedores", order: 3 },
    { name: "Cocinas", slug: "cocinas", order: 4 },
    { name: "Oficinas", slug: "oficinas", order: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Materiales de ejemplo
  const materials = ["Madera Maciza", "MDF", "Melamina", "Roble", "Cedro"];
  for (const name of materials) {
    await prisma.material.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Medidas de ejemplo
  const measurements = [
    { label: "1 plaza (90x190 cm)", description: "Ideal para habitaciones pequenas" },
    { label: "2 plazas (140x190 cm)", description: "Para dormitorios estandar" },
    { label: "Matrimonial (160x200 cm)", description: "Comodidad para dos" },
    { label: "King (200x200 cm)", description: "Maxima comodidad" },
  ];
  for (const m of measurements) {
    await prisma.measurement.upsert({
      where: { label: m.label },
      update: {},
      create: m,
    });
  }

  console.log("Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
