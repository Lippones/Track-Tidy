'use server'

import { authActionClient } from '@/lib/safe-action'
import { auth } from '@workspace/auth'
import { tasks } from '@workspace/tasks/trigger'
import { headers } from 'next/headers'
import { z } from 'zod'
import type { playlistOrganize } from '@workspace/tasks'
import { prisma } from '@workspace/prisma'

const inputSchema = z.object({
  playlists: z.array(
    z.object({
      playlistId: z.string(),
      name: z.string(),
      image: z.string().optional(),
      type: z.enum(['PLAYLIST', 'LIKED']),
      totalTracks: z.number().optional()
    })
  ),
  maxPlaylists: z
    .number()
    .min(1, 'Max playlists must be at least 1')
    .max(10, 'Max playlists cannot exceed 10'),
  prompt: z.string().min(1, 'Prompt is required')
})

export const createPlaylistJob = authActionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { playlists, prompt, maxPlaylists } }) => {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const userId = session.user.id

    const job = await prisma.playlistJob.create({
      data: {
        userId,
        prompt,
        inputs: {
          create: playlists.map((p) => ({
            playlistId: p.playlistId,
            name: p.name,
            image: p.image,
            type: p.type,
            totalTracks: p.totalTracks
          }))
        }
      },
      include: { inputs: true }
    })

    await tasks.trigger<typeof playlistOrganize>('playlist-organize', {
      jobId: job.id,
      advancedOptions: {
        maxPlaylists
      }
    })

    return job
  })
