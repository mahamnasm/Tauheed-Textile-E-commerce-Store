import { PrismaClient } from "@prisma/client";

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://placeholder:placeholder@localhost:5432/placeholder?sslmode=require";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const isConfigured = Boolean(
  process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("placeholder") &&
    !process.env.DATABASE_URL.includes("localhost:5432/placeholder")
);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: isConfigured ? ["error"] : [],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(
    url &&
      !url.includes("placeholder") &&
      !url.includes("localhost:5432/placeholder")
  );
}
