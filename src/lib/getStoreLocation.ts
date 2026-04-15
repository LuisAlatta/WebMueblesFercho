import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getStoreLocation = cache(async () => {
  const [config, photos] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
    prisma.storeDirectionPhoto.findMany({ orderBy: { order: "asc" } }),
  ]);
  return { config, photos };
});
