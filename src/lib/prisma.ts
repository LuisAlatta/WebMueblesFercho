import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Increase pool timeout for build workers to avoid connection pool exhaustion
  const url = process.env.DATABASE_URL ?? "";
  const separator = url.includes("?") ? "&" : "?";
  const datasourceUrl = url.includes("pool_timeout") ? url : `${url}${separator}pool_timeout=30`;

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasourceUrl,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
