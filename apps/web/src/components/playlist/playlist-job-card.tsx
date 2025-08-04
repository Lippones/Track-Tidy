import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Loader2, CheckCircle, Music, ListMusic } from 'lucide-react'
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
          <Badge
            variant="default"
            className="bg-gray-300 hover:bg-gray-300/80 text-white"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            DRAFT
          </Badge>
        )
      case 'COMPLETED':
        return (
          <Badge
            variant="default"
            className="bg-green-500 hover:bg-green-500/80"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Concluído
          </Badge>
        )
      case 'PROCESSING':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500 hover:bg-yellow-500/80 text-white"
          >
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Processando
          </Badge>
        )
      case 'FAILED':
        return <Badge variant="destructive">Falhou</Badge>
      default:
        return <Badge variant="outline">{currentStatus}</Badge>
    }
  }

  return (
    <Card className="w-md bg-secondary">
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-2">
          {playlistName}
          {getStatusBadge(status)}
        </CardTitle>
        <CardDescription>Prompt: {prompt || 'N/A'}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Total de Músicas: <Badge variant="outline">{totalTracks}</Badge>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ListMusic className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Total de Playlists criadas:{' '}
            <Badge variant="outline">{playlistJobResults.length}</Badge>
          </span>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          {playlistJobResults.map((result) => (
            <Button
              key={result.id}
              className="w-full bg-[#1ED760] hover:bg-[#1ED760]/80 text-black"
              asChild
            >
              <Link
                href={makePlaylistUrl(result.playlistId)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 256 256"
                  width="256"
                  height="256"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                >
                  <path
                    d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128 70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007l.001-.006Zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644-30.053-18.357-67.885-22.515-112.44-12.335a7.981 7.981 0 0 1-9.552-6.007 7.968 7.968 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276 3.76 2.308 4.952 7.215 2.644 10.975Zm15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289-34.406-21.148-86.853-27.273-127.548-14.92-5.278 1.594-10.852-1.38-12.454-6.649-1.59-5.278 1.386-10.842 6.655-12.446 46.485-14.106 104.275-7.273 143.787 17.007 4.692 2.89 6.175 9.034 3.286 13.72v-.001Zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405-3.362 5.69-10.73 7.565-16.4 4.187h-.006Z"
                    fill="#000"
                  />
                </svg>
                {result.name} ({result.totalTracks || 0} músicas)
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
