import Image from 'next/image'
import { Check, Music } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { ScrollArea } from '@workspace/ui/components/scroll-area'

interface SelectPlaylistsProps {
  playlists: Array<{
    id: string
    name: string
    total: number
    image: string | null
  }>
  value: string[]
  onSelect: (selectedIds: string[]) => void
}

export function SelectPlaylists({
  playlists,
  onSelect,
  value
}: SelectPlaylistsProps) {
  const handleTogglePlaylist = (playlistId: string) => {
    const newSelection = value.includes(playlistId)
      ? value.filter((id) => id !== playlistId)
      : [...value, playlistId]

    onSelect(newSelection)
  }

  const handleSelectAll = () => {
    if (value.length === playlists.length) {
      onSelect([])
    } else {
      onSelect(playlists.map((p) => p.id))
    }
  }

  return (
    <div className="w-full">
      <div className="pb-3 flex items-center justify-between gap-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="mt-2 bg-transparent w-full"
        >
          {value.length === playlists.length
            ? 'Desmarcar Todas'
            : 'Selecionar Todas'}
        </Button>
      </div>
      <div>
        <ScrollArea className="h-80 w-full">
          <div className="space-y-1">
            {playlists.map((playlist) => {
              const isSelected = value.includes(playlist.id)

              return (
                <div
                  key={playlist.id}
                  onClick={() => handleTogglePlaylist(playlist.id)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                    hover:bg-muted/50 active:scale-[0.98]
                    ${isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted'}
                  `}
                >
                  <div className="relative">
                    {playlist.image ? (
                      <Image
                        src={playlist.image}
                        alt={playlist.name}
                        width={48}
                        height={48}
                        className="rounded-sm object-cover size-12"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                        <Music className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{playlist.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {playlist.total}{' '}
                      {playlist.total === 1 ? 'música' : 'músicas'}
                    </p>
                  </div>

                  <div
                    className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30 hover:border-primary/50'}
                  `}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
