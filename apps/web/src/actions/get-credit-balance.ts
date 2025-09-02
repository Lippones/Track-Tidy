'use server'

import { authActionClient } from '@/lib/safe-action'
import { prisma } from '@workspace/prisma'

export const getCreditsBalance = authActionClient.action(
  async ({ ctx: { user } }) => {
    const userCredits = await prisma.user.findUnique({
      where: {
        id: user.id
      },
      select: {
        credits: true
      }
    })

    console.log('userCredits', userCredits)

    if (!userCredits) {
      throw new Error('User not found')
    }

    return userCredits.credits
  }
)
