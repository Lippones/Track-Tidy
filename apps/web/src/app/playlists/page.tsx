import { Header } from '@/components/playlist/header'
import { PlayListJobs } from '@/components/playlist/playlist-jobs'
import { getQueryClient } from '@/lib/get-query-client'
import { getPlaylistJobs } from '@/services/playlists'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function PlayList() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['playlist-jobs', { page: 1, limit: 10 }],
    queryFn: async () => getPlaylistJobs({ page: 1, limit: 10 })
  })

  return (
    <div>
      <Header />

      <div className="container w-full mx-auto p-4">
        <h1 className="text-2xl font-bold">PlayList</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Aqui você pode ver os jobs de playlists que foram criados. Cada job
          representa uma solicitação para criar uma playlist com base em um
          prompt específico. Você pode clicar em cada job para ver os detalhes e
          acessar a playlist criada.
        </p>

        <Button>
          <Link
            href="/start/playlists"
            className="flex items-center justify-center w-full h-full"
          >
            Criar nova playlist
          </Link>
        </Button>

        <div className="mt-10 w-full">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<div>Loading...</div>}>
              <PlayListJobs />
            </Suspense>
          </HydrationBoundary>
        </div>
      </div>
    </div>
  )
}
