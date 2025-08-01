import { spotifyFetch } from '@/lib/spotify'
import type { PlayList, SavedTrack } from './types'

export async function fetchUserPlaylists(token: string) {
  const headers = { Authorization: `Bearer ${token}` }

  const [playlists, liked] = await Promise.all([
    spotifyFetch<{
      items: Array<PlayList>
    }>('/me/playlists', { headers }),
    spotifyFetch<{
      items: Array<SavedTrack>
      total: number
    }>('/me/tracks?limit=1', { headers })
  ])

  const formattedPlaylists = playlists.items.map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    total: playlist.tracks.total,
    image: playlist.images?.[0]?.url || null
  }))

  if (liked.total > 0) {
    formattedPlaylists.unshift({
      id: 'liked',
      name: 'Curtidas',
      total: liked.total,
      image: null
    })
  }

  return formattedPlaylists
}
