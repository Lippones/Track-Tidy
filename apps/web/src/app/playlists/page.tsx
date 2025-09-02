import { getPlaylistJobs } from '@/actions/get-playlists-jobs'
import { Header } from '@/components/playlist/header'
import { PlaylistFilters } from '@/components/playlist/playlist-filters'
import { PlayListJobSkeleton } from '@/components/playlist/playlist-job-skeleton'
import { PlayListJobs } from '@/components/playlist/playlist-jobs'
import { getQueryClient } from '@/lib/get-query-client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Playlists',
  description: 'Gerencie e veja os andamento da suas playlists.'
}

export default async function PlayList() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
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

  return (
    <div>
      <Header />

      <div className="container w-full mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Playlists</h1>

        <PlaylistFilters />

        <div className="w-full">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<PlayListJobSkeleton />}>
              <PlayListJobs />
            </Suspense>
          </HydrationBoundary>
        </div>
      </div>
    </div>
  )
}
