'use server'

import { authActionClient } from '@/lib/safe-action'
import { auth } from '@workspace/auth'
import { prisma } from '@workspace/prisma'
import { headers } from 'next/headers'
import z from 'zod'

const inputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20)
})

export const getPlaylistJobs = authActionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { limit, page } }) => {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      throw new Error('Unauthorized')
    }

    const [jobs, totalCount] = await prisma.$transaction([
      prisma.playlistJob.findMany({
        where: { userId: session.user.id },
        include: { playlistJobResults: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.playlistJob.count({
        where: { userId: session.user.id }
      })
    ])

    return { jobs, totalCount, page, limit }
  })
