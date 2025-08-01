import { type PlaylistsSchemaType } from '../schemas/playlist-schema'

interface CreatePlaylistsOnSpotifyProps {
  userId: string
  accessToken: string
  aiResult: PlaylistsSchemaType
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

export async function createPlaylistsOnSpotify({
  accessToken,
  aiResult,
  userId
}: CreatePlaylistsOnSpotifyProps) {
  const created: {
    id: string
    name: string
    description?: string
    totalTracks: number
  }[] = []

  for (const p of aiResult.playlists) {
    try {
      // cria playlist
      const playlist = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({
            name: p.name,
            description: p.description,
            public: false
          })
        }
      ).then((r) => r.json() as Promise<{ id: string }>)

      if (!playlist.id) {
        console.error(`❌ Falha ao criar playlist: ${p.name}`, playlist)
        continue
      }

      console.log(`✅ Criada playlist: ${p.name} (${playlist.id})`)

      const uris = p.tracks
        .map((t) => t && `spotify:track:${t}`)
        .filter((u): u is string => Boolean(u))

      if (uris.length === 0) {
        console.warn(`⚠️ Skipping playlist ${p.name}, nenhuma track válida`)
        continue
      }

      // fatiar em blocos de até 100
      const chunks = chunkArray(uris, 100)

      for (const [i, chunk] of chunks.entries()) {
        try {
          const res = await fetch(
            `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ uris: chunk })
            }
          ).then((r) => r.json())

          if (res.error) {
            console.error(
              `❌ Erro ao adicionar tracks (chunk ${i + 1}/${chunks.length}) na playlist ${p.name}`,
              res.error
            )
          } else {
            console.log(
              `✅ Adicionado chunk ${i + 1}/${chunks.length} na playlist ${p.name}`
            )
          }
        } catch (err) {
          console.error(
            `❌ Falha inesperada ao adicionar chunk na playlist ${p.name}`,
            err
          )
        }
      }

      created.push({
        id: playlist.id,
        name: p.name,
        description: p.description,
        totalTracks: p.tracks.length
      })
    } catch (err) {
      console.error(`❌ Erro geral na playlist ${p.name}`, err)
      continue
    }
  }

  return created
}
