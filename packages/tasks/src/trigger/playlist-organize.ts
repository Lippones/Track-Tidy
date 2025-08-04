import { logger, schemaTask } from '@trigger.dev/sdk/v3'
import { z } from 'zod'
import { getTracksFromSpotify } from '../utils/get-tracks-from-spotify'
import { organizeTracksWithAI } from '../utils/organize-tracks-with-ai'
import { createPlaylistsOnSpotify } from '../utils/create-playlists-on-spotify'
import { prisma } from '@workspace/prisma'
import { organizeLargePlaylist } from '../utils/organize-large-playlist'
import { auth } from '@workspace/auth'

export const playlistOrganize = schemaTask({
  id: 'playlist-organize',
  schema: z.object({
    jobId: z.string(),
    advancedOptions: z
      .object({
        chunkSize: z.number().default(200).optional(),
        maxPlaylists: z.number().min(1).max(10).default(1)
      })
      .optional()
  }),
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000 * 60, // 1 minute,
    factor: 2
  },
  run: async ({ jobId, advancedOptions }) => {
    const startTime = Date.now()
    logger.info(`[Job ${jobId}] Iniciando processamento`)

    const playlistJob = await prisma.playlistJob.findUnique({
      where: { id: jobId },
      include: {
        user: {
          include: {
            accounts: {
              where: {
                providerId: 'spotify'
              }
            }
          }
        },
        inputs: true
      }
    })

    const spotifyAccessToken = await auth.api.getAccessToken({
      body: {
        providerId: 'spotify',
        userId: playlistJob?.userId
      }
    })

    if (!playlistJob) throw new Error(`Job ${jobId} não encontrado`)
    if (!spotifyAccessToken || !playlistJob.user.accounts[0])
      throw new Error('Token de acesso faltando')

    // 2. Atualiza status para PROCESSING
    await prisma.playlistJob.update({
      where: { id: jobId },
      data: { status: 'PROCESSING' }
    })

    const spotifyStart = Date.now()

    // 3. Busca as tracks (igual ao atual)
    const tracks = await getTracksFromSpotify(
      playlistJob.inputs,
      spotifyAccessToken.accessToken
    )

    logger.info('tracks', tracks[0])

    logger.info(
      `[Job ${jobId}] Tracks encontradas: ${tracks.length} (${Date.now() - spotifyStart}ms)`
    )

    const aiStart = Date.now()
    // 4. Organização com NOVA lógica (chunking + K-means)
    const { playlists } = await organizeLargePlaylist(
      tracks,
      playlistJob.prompt || 'Organize estas músicas',
      {
        chunkSize: advancedOptions?.chunkSize, // ← Parâmetros novos
        maxPlaylists: advancedOptions?.maxPlaylists
      }
    )

    logger.info(
      `[Job ${jobId}] IA processou ${playlists.length} playlists (${Date.now() - aiStart}ms)`
    )

    const spotifyCreateStart = Date.now()

    // 5. Cria playlists no Spotify (igual ao atual)
    const createdPlaylists = await createPlaylistsOnSpotify({
      userId: playlistJob.user.accounts[0].accountId,
      accessToken: spotifyAccessToken.accessToken,
      aiResult: { playlists }
    })

    logger.info(
      `[Job ${jobId}] Playlists criadas no Spotify: ${createdPlaylists.length} (${Date.now() - spotifyCreateStart}ms)`
    )

    // 6. Atualiza o job com resultados (igual ao atual)
    await prisma.playlistJob.update({
      where: { id: jobId },
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

    logger.info(
      `[Job ${jobId}] ✅ Tarefa concluída em ${(Date.now() - startTime) / 1000}s`
    )

    return { success: true, playlists: createdPlaylists }
  }
})
