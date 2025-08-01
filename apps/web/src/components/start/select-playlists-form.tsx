'use client'
import { Card, CardHeader } from '@workspace/ui/components/card'
import { SelectPlaylists } from '../select-playlists'
import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SelectPlaylistsFormProps {
  playlists: Array<{
    id: string
    name: string
    total: number
    image: string | null
  }>
}

export function SelectPlaylistsForm({ playlists }: SelectPlaylistsFormProps) {
  const router = useRouter()
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (selectedPlaylists.length === 0) {
      toast.error('Por favor, selecione pelo menos uma playlist.')
      return
    }

    const selectedPlaylistsData = playlists.filter((p) =>
      selectedPlaylists.includes(p.id)
    )

    localStorage.setItem(
      'selectedPlaylists',
      JSON.stringify(selectedPlaylistsData)
    )
    toast.success('Playlists selecionadas com sucesso!')

    router.push('/start/prompt')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <Card className="w-full">
        <CardHeader className="pb-3">
          <SelectPlaylists
            playlists={playlists}
            value={selectedPlaylists}
            onSelect={setSelectedPlaylists}
          />
        </CardHeader>
      </Card>

      <Button size={'xl'} disabled={selectedPlaylists.length < 1}>
        Continuar
      </Button>
    </form>
  )
}
