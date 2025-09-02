'use server'

import { authActionClient } from '@/lib/safe-action'
import { prisma } from '@workspace/prisma'

export const getCreditsPackages = authActionClient.action(async () => {
  const packages = await prisma.creditPackage.findMany()

  return packages
})
