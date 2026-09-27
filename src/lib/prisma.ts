import { PrismaClient } from "@prisma/client";

const CLOUD_DATABASE_URL =
  "postgresql://neondb_owner:npg_sDFJWa1k7dZx@ep-lucky-wave-aeftpyv1-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const databaseUrl =
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("placeholder") &&
  !process.env.DATABASE_URL.includes("localhost:5432")
    ? process.env.DATABASE_URL
    : CLOUD_DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function isDatabaseConfigured(): boolean {
  return true;
}
