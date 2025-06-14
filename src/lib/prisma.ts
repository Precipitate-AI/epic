// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// This setup is a best practice for using Prisma with Next.js.
// It prevents creating too many instances of Prisma Client in development
// due to Next.js's hot-reloading feature.

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // Optional: logs database queries to the console
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
