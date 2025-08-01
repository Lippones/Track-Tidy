'server-only'
import { PrismaClient } from '@workspace/prisma'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()
