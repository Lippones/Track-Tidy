import type { PlaylistJob, PlaylistJobResult } from '@workspace/prisma'

interface PlaylistJobsResponse {
  jobs: (PlaylistJob & {
    playlistJobResults: PlaylistJobResult[]
  })[]
}

export async function getPlaylistJobs({
  page,
  limit
}: {
  page: number
  limit: number
}) {
  return fetch(`/api/playlists?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => res.json() as Promise<PlaylistJobsResponse>)
}
