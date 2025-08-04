import { openai } from '@ai-sdk/openai'
import { embedMany } from 'ai'
import { makePlaylistsSchema } from '../schemas/playlist-schema'
import { generateObject } from 'ai'
import type { TrackInfo } from './get-tracks-from-spotify'
import { kmeans } from 'ml-kmeans'

/**
 * Organizes large Spotify playlists using AI with chunking and embeddings for efficiency.
 *
 * @param tracks - Array of TrackInfo objects (must include `id`, `name`, `artists`, and optional `genres`).
 * @param prompt - User instruction for playlist organization (e.g., "Group by genre").
 * @param options - {
 *   chunkSize: number = 200,  // Tracks per chunk
 *   maxPlaylists: number = 10 // Max playlists to output
 * }
 */
export async function organizeLargePlaylist(
  tracks: TrackInfo[],
  prompt: string,
  options?: { chunkSize?: number; maxPlaylists?: number }
) {
  const { chunkSize = 50, maxPlaylists = 10 } = options || {}

  console.log(`Processando ${tracks.length} faixas com chunkSize=${chunkSize}`)

  // --- Etapa 1: Pré-processamento com Embeddings ---
  const { embeddings } = await embedMany({
    model: openai.textEmbeddingModel('text-embedding-3-small'),
    values: tracks.map((t) => `${t.name} - ${t.artists.join(', ')}`)
  })

  // --- Etapa 2: Clusterização Automática ---
  let clusteredTracks: TrackInfo[][]
  if (tracks.length > chunkSize) {
    try {
      const k = Math.min(maxPlaylists, Math.ceil(tracks.length / chunkSize) * 2)
      clusteredTracks = clusterTracksByEmbeddings(tracks, embeddings, k)
      console.log(`Clusters criados: ${clusteredTracks.length}`)
      clusteredTracks.forEach((cluster, i) => {
        console.log(`Cluster ${i + 1}: ${cluster.length} faixas`)
      })
    } catch (error) {
      console.error('Clusterização falhou:', error)
      // Fallback: Divide em chunks manuais
      clusteredTracks = []
      for (let i = 0; i < tracks.length; i += chunkSize) {
        clusteredTracks.push(tracks.slice(i, i + chunkSize))
      }
    }
  } else {
    clusteredTracks = [tracks]
  }

  // --- Etapa 3: Processamento Paralelo por Chunk ---
  const chunkPromises = clusteredTracks.map((chunk, i) =>
    processChunkWithAI(chunk, prompt, maxPlaylists)
  )

  const chunkResults = await Promise.all(chunkPromises)

  // --- Etapa 4: Consolidação e Validação ---
  const finalPlaylists = consolidatePlaylists(
    chunkResults,
    tracks.map((t) => t.id)
  )

  console.log(
    `Playlists finais: ${finalPlaylists.length}, Total de faixas: ${finalPlaylists.reduce(
      (sum, p) => sum + p.tracks.length,
      0
    )}`
  )
  finalPlaylists.forEach((p, i) => {
    console.log(`Playlist ${i + 1}: ${p.name}, Faixas: ${p.tracks.length}`)
  })

  return { playlists: finalPlaylists.slice(0, maxPlaylists) }
}

/**
 * Clusteriza faixas por similaridade de embeddings usando K-means
 */
function clusterTracksByEmbeddings(
  tracks: TrackInfo[],
  embeddings: number[][],
  k: number
): TrackInfo[][] {
  try {
    const normalizedEmbeddings = embeddings.map((embedding) => {
      const norm = Math.sqrt(embedding.reduce((sum, x) => sum + x * x, 0))
      return embedding.map((x) => x / (norm || 1))
    })

    // Garante pelo menos 5 clusters ou mais, dependendo do tamanho
    const minClusters = Math.max(5, Math.ceil(tracks.length / 50))
    const finalK = Math.min(k, minClusters, tracks.length)
    console.log(`Calculando ${finalK} clusters para ${tracks.length} faixas`)

    const { clusters } = kmeans(normalizedEmbeddings, finalK, {
      initialization: 'kmeans++',
      maxIterations: 100
    })

    const clusteredTracks: TrackInfo[][] = Array(finalK)
      .fill(null)
      .map(() => [])

    clusters.forEach((clusterIndex, trackIndex) => {
      clusteredTracks[clusterIndex]?.push(tracks[trackIndex] as TrackInfo)
    })

    return clusteredTracks.filter((cluster) => cluster.length > 0)
  } catch (error) {
    console.error('Clusterization failed:', error)
    // Fallback: Divide em chunks manuais
    const chunkSize = 50
    const manualClusters: TrackInfo[][] = []
    for (let i = 0; i < tracks.length; i += chunkSize) {
      manualClusters.push(tracks.slice(i, i + chunkSize))
    }
    return manualClusters
  }
}

async function processChunkWithAI(
  tracks: TrackInfo[],
  prompt: string,
  maxPlaylists: number
) {
  try {
    const { object } = await generateObject({
      model: openai('o4-mini'),
      schema: makePlaylistsSchema(tracks.map((t) => t.id)),
      prompt: `
        INSTRUCTIONS:
        1. Crie até ${maxPlaylists} playlists com base no seguinte prompt: "${prompt}".
        2. Use SOMENTE estas faixas: [${tracks.map((t) => t.id).join(', ')}].
        3. NUNCA invente novos IDs ou modifique os existentes.
        4. Inclua TODAS as faixas fornecidas, agrupando-as em playlists que façam sentido com o prompt.
        5. Se uma faixa não se encaixar claramente em uma playlist, coloque-a em uma playlist chamada "Outros".
        6. Remova duplicatas.
        7. Certifique-se de que cada playlist tenha um nome e descrição claros, refletindo o prompt.

        TRACKS METADATA:
        ${tracks.map((t) => `- ${t.name} by ${t.artists.join(', ')} (ID: ${t.id})`).join('\n')}
      `
    })

    return object.playlists
  } catch (error) {
    console.error(`Failed to process chunk: ${error}`)
    return []
  }
}

/** Valida e consolida playlists de múltiplos chunks */
function consolidatePlaylists(
  chunkResults: { name: string; description: string; tracks: string[] }[][],
  validTrackIds: string[]
) {
  const playlistMap: Record<
    string,
    { name: string; description: string; tracks: Set<string> }
  > = {}

  chunkResults.forEach((playlists) => {
    playlists.forEach((playlist) => {
      if (!playlistMap[playlist.name]) {
        playlistMap[playlist.name] = {
          name: playlist.name,
          description: playlist.description,
          tracks: new Set()
        }
      }

      // Filtra IDs inválidos e duplicados
      playlist.tracks.forEach((id) => {
        if (validTrackIds.includes(id)) {
          playlistMap[playlist.name]?.tracks.add(id)
        }
      })
    })
  })

  return Object.values(playlistMap).map((p) => ({
    ...p,
    tracks: Array.from(p.tracks)
  }))
}
