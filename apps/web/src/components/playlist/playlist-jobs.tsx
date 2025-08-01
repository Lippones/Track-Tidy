'use client'

import { getPlaylistJobs } from '@/actions/get-playlist-jobs'
import { useSuspenseQuery } from '@tanstack/react-query'
import PlaylistJobCard from './playlist-job-card'

export function PlayListJobs() {
  const {
    data: { jobs }
  } = useSuspenseQuery({
    queryKey: ['playlist-jobs', { page: 1, limit: 10 }],
    queryFn: async () => {
      const res = await getPlaylistJobs({ page: 1, limit: 10 })

      if (res.serverError || !res.data) {
        throw new Error(res.serverError)
      }

      return res.data
    }
  })

  return (
    <div className="w-full">
      <ul className="flex gap-4 flex-wrap w-full">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <li key={job.id}>
              <PlaylistJobCard
                id={job.id}
                userId={job.userId}
                prompt={job.prompt}
                status={job.status}
                createdAt={job.createdAt.toString()}
                completedAt={job.completedAt?.toString() || null}
                resultPlaylistId={job.resultPlaylistId}
                playlistJobResults={job.playlistJobResults || []}
              />
            </li>
          ))
        ) : (
          <p>Nenhum job de playlist encontrado.</p>
        )}
      </ul>
    </div>
  )
}
