import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  (process.env.NODE_ENV === 'development'
    ? new PrismaClient({ log: ['query'] })
    : new PrismaClient());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
