import type { PlaylistJobInput } from '@workspace/prisma'

export type TrackInfo = {
  id: string
  name: string
  artists: string[]
}

export async function getTracksFromSpotify(
  inputs: PlaylistJobInput[],
  accessToken: string
): Promise<TrackInfo[]> {
  const allTracks: TrackInfo[] = []

  for (const input of inputs) {
    const isLiked = input.type === 'LIKED'

    let nextUrl = isLiked
      ? 'https://api.spotify.com/v1/me/tracks?limit=50'
      : `https://api.spotify.com/v1/playlists/${input.playlistId}/tracks?limit=50`

    while (nextUrl) {
      const res = await fetch(nextUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!res.ok) {
        console.error(
          `Failed to fetch tracks from ${input.name}:`,
          await res.text()
        )
        break
      }

      const data = await res.json()

      const items = isLiked
        ? data.items.map((i: any) => i.track)
        : data.items.map((i: any) => i.track)

      for (const track of items) {
        if (!track || !track.id) continue

        allTracks.push({
          id: track.id,
          name: track.name,
          artists: track.artists.map((a: any) => a.name)
        })
      }

      nextUrl = data.next
    }
  }

  return allTracks
}
