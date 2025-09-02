'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import PlaylistJobCard from './playlist-job-card'
import { getPlaylistJobs } from '@/actions/get-playlists-jobs'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'

export function PlayListJobs() {
  const {
    data: { jobs }
  } = useSuspenseQuery({
    queryKey: ['playlist-jobs', { page: 1, limit: 10 }],
    queryFn: async () => {
      const { data, serverError } = await getPlaylistJobs({
        page: 1,
        limit: 10
      })

      if (serverError || !data) {
        throw new Error(serverError)
      }

      return data
    }
  })

  if (jobs.length === 0) {
    return (
      <div className="w-full flex flex-col gap-4 items-center justify-center p-8">
        <p className="text-muted-foreground">You have no playlist yet.</p>

        <Button asChild>
          <Link href="/start">Create your first playlist</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {jobs.map((job) => (
          <PlaylistJobCard
            key={job.id}
            id={job.id}
            userId={job.userId}
            prompt={job.prompt}
            status={job.status}
            createdAt={job.createdAt.toString()}
            completedAt={job.completedAt?.toString() || null}
            resultPlaylistId={job.resultPlaylistId}
            playlistJobResults={job.playlistJobResults || []}
          />
        ))}
      </div>
    </div>
  )
}
