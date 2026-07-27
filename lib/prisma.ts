import { PrismaClient } from "@prisma/client";

/**
 * A single shared PrismaClient. In dev, Next.js hot-reload re-imports modules
 * on every change; without this guard each reload would open a new connection
 * pool and eventually exhaust the database. Stashing the instance on `globalThis`
 * keeps exactly one across reloads. In production the module is evaluated once.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
