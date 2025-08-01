import { prisma } from '@/lib/prisma'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'

const inputSchema = z.object({
  page: z.number().min(1, 'Page number must be at least 1'),
  limit: z
    .number()
    .min(1, 'Limit must be at least 1')
    .max(20, 'Limit cannot exceed 100')
})

export const getPlaylistJobs = authActionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { page, limit }, ctx }) => {
    const userId = ctx.user.id

    const jobs = await prisma.playlistJob.findMany({
      where: {
        userId
      },
      include: {
        playlistJobResults: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    return {
      jobs
    }
  })
