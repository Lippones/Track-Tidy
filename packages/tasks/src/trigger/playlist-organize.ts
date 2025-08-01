import { PrismaClient } from '@workspace/prisma'
import { logger, schemaTask } from '@trigger.dev/sdk/v3'
import { z } from 'zod'
import { getTracksFromSpotify } from '../utils/get-tracks-from-spotify'
import { organizeTracksWithAI } from '../utils/organize-tracks-with-ai'
import { createPlaylistsOnSpotify } from '../utils/create-playlists-on-spotify'

const prisma = new PrismaClient()

export const playlistOrganize = schemaTask({
  id: 'playlist-organize',
  schema: z.object({
    jobId: z.string()
  }),
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000 * 60, // 1 minute,
    factor: 2
  },
  run: async ({ jobId }) => {
    const playlistJobExists = await prisma.playlistJob.findUnique({
      where: {
        id: jobId
      },
      include: {
        inputs: true,
        user: {
          select: {
            id: true,
            accounts: {
              where: {
                providerId: 'spotify'
              },
              select: {
                accountId: true,
                accessToken: true
              }
            }
          }
        }
      }
    })

    if (!playlistJobExists) {
      throw new Error(`Playlist job with ID ${jobId} does not exist`)
    }

    await prisma.playlistJob.update({
      where: {
        id: jobId
      },
      data: {
        status: 'PENDING'
      }
    })

    if (!playlistJobExists.user.accounts[0]?.accessToken) {
      throw new Error('No access token found for the user')
    }

    const tracks = await getTracksFromSpotify(
      playlistJobExists.inputs,
      playlistJobExists.user.accounts[0]?.accessToken
    )

    logger.info(`Fetched ${tracks.length} tracks from Spotify`)

    await prisma.playlistJob.update({
      where: {
        id: jobId
      },
      data: {
        status: 'PROCESSING'
      }
    })

    logger.info('Organizing tracks with AI...')

    const { playlists } = await organizeTracksWithAI(
      tracks,
      playlistJobExists.prompt || 'Organize these tracks'
    )

    logger.info('Organized tracks with AI', {
      jobId,
      playlists
    })

    logger.info('Creating playlists on Spotify...')

    const createdPlaylists = await createPlaylistsOnSpotify({
      userId: playlistJobExists.user.accounts[0].accountId,
      accessToken: playlistJobExists.user.accounts[0].accessToken,
      aiResult: {
        playlists
      }
    })

    logger.info('Created playlists on Spotify', {
      jobId,
      createdPlaylists
    })

    logger.info('Playlists created successfully', {
      jobId
    })

    logger.info('Playlists created successfully')

    await prisma.playlistJob.update({
      where: {
        id: jobId
      },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        playlistJobResults: {
          createMany: {
            data: createdPlaylists.map((p) => ({
              playlistId: p.id,
              name: p.name,
              totalTracks: p.totalTracks,
              description: p.description
            }))
          }
        }
      }
    })
  }
})
