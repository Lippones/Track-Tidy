'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { CheckCircle, Music, ListMusic, Loader } from 'lucide-react'
import type { PlaylistJobResult } from '@workspace/prisma'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { makePlaylistUrl } from '@/utils/make-playlist-url'

interface PlaylistJobCardProps {
  id: string
  userId: string
  prompt: string | null
  status: 'DRAFT' | 'COMPLETED' | 'PROCESSING' | 'FAILED' | 'PENDING'
  createdAt: string
  completedAt: string | null
  resultPlaylistId: string | null
  playlistJobResults: PlaylistJobResult[]
}

export default function PlaylistJobCard({
  prompt,
  status,
  playlistJobResults
}: PlaylistJobCardProps) {
  const playlistName = playlistJobResults[0]?.name || 'N/A'
  const totalTracks = playlistJobResults[0]?.totalTracks || 0

  const getStatusBadge = (currentStatus: string) => {
    switch (currentStatus) {
      case 'DRAFT':
        return (
          <Badge className="h-6 bg-gray-600 text-gray-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Rascunho
          </Badge>
        )
      case 'COMPLETED':
        return (
          <Badge className="h-6 bg-green-600 text-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Concluído
          </Badge>
        )
      case 'PROCESSING':
        return (
          <Badge className="h-6 bg-blue-600 text-blue-200">
            <Loader className="mr-1 h-3 w-3 animate-spin" />
            Processando
          </Badge>
        )
      case 'FAILED':
        return <Badge className="h-6 bg-red-600 text-red-200">Falhou</Badge>
      case 'PENDING':
        return (
          <Badge className="h-6 bg-yellow-600 text-yellow-200">Pendente</Badge>
        )
      default:
        return (
          <Badge className="h-6 bg-gray-100 text-gray-200">
            {currentStatus}
          </Badge>
        )
    }
  }

  return (
    <Card
      className={`w-full ${playlistJobResults.length > 0 ? 'pb-0 overflow-hidden' : ''}`}
    >
      <CardHeader>
        <CardTitle className="flex justify-between gap-2">
          <span>{playlistName}</span>
          {getStatusBadge(status)}
        </CardTitle>
        <CardDescription className="line-clamp-4">
          {prompt || 'Nenhum prompt fornecido'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Músicas: <Badge variant="secondary">{totalTracks}</Badge>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ListMusic className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Playlists:{' '}
              <Badge variant="secondary">{playlistJobResults.length}</Badge>
            </span>
          </div>
        </div>
      </CardContent>
      {playlistJobResults.length > 0 && (
        <CardFooter className="border-t p-0 bg-secondary pb-6 mt-auto">
          <div className="flex flex-col w-full gap-2 px-4 items-center">
            {playlistJobResults.map((result) => (
              <Button
                key={result.id}
                variant="default"
                className="gap-2"
                asChild
              >
                <Link
                  href={makePlaylistUrl(result.playlistId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 256 256"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128 70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007l.001-.006Zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644-30.053-18.357-67.885-22.515-112.44-12.335a7.981 7.981 0 0 1-9.552-6.007 7.968 7.968 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276 3.76 2.308 4.952 7.215 2.644 10.975Zm15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289-34.406-21.148-86.853-27.273-127.548-14.92-5.278 1.594-10.852-1.38-12.454-6.649-1.59-5.278 1.386-10.842 6.655-12.446 46.485-14.106 104.275-7.273 143.787 17.007 4.692 2.89 6.175 9.034 3.286 13.72v-.001Zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405-3.362 5.69-10.73 7.565-16.4 4.187h-.006Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className=" line-clamp-1 text-left whitespace-normal">
                    {result.name}
                  </span>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                    {result.totalTracks || 0}
                  </Badge>
                </Link>
              </Button>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
