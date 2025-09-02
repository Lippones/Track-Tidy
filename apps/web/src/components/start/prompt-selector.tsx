'use client'

import { predefinedPrompts } from '@/_constraits/prompts'
import { createPlaylistJob } from '@/actions/create-playlist-job'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Textarea } from '@workspace/ui/components/textarea'
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem
} from '@workspace/ui/components/select'
import { Send } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function PromptSelector() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [maxPlaylists, setMaxPlaylists] = useState(1)

  const handlePromptSelect = (prompt: (typeof predefinedPrompts)[0]) => {
    setSelectedPrompt(prompt.id)
    setCustomPrompt(prompt.prompt)
    setIsCustomMode(false)
  }

  const handleCustomMode = () => {
    setIsCustomMode(true)
    setSelectedPrompt(null)
    setCustomPrompt('')
  }

  async function handleSubmit() {
    const toastId = toast.loading('Criando playlist...')
    try {
      setIsLoading(true)
      if (!customPrompt.trim()) {
        toast.error(
          'Por favor, descreva como você quer organizar suas playlists.'
        )
      }

      const playlists = JSON.parse(
        localStorage.getItem('selectedPlaylists') || '[]'
      ) as Array<{
        id: string
        name: string
        total: number
        image: string | null
      }>

      await createPlaylistJob({
        maxPlaylists,
        playlists: playlists.map((p) => ({
          playlistId: p.id,
          name: p.name,
          image: p.image || undefined,
          type: p.id === 'liked' ? 'LIKED' : 'PLAYLIST',
          totalTracks: p.total
        })),
        prompt:
          customPrompt ??
          (predefinedPrompts.find((p) => p.id === selectedPrompt)?.prompt || '')
      })

      toast.success(
        'Playlist criada com sucesso! Você pode ver os jobs na página de playlists.',
        {
          id: toastId
        }
      )

      localStorage.removeItem('selectedPlaylists') // TODO: Criar uma store

      router.push('/playlists')
    } catch {
      toast.error('Erro ao criar a playlist. Tente novamente.', {
        id: toastId
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Estilos de Organização</h2>
          <Button
            variant="outline"
            onClick={handleCustomMode}
            className={isCustomMode ? 'bg-green-50 border-green-300' : ''}
            asChild
          >
            <Link href="#prompt">Descrever Personalizado</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {predefinedPrompts.map((prompt) => {
            const IconComponent = prompt.icon
            const isSelected = selectedPrompt === prompt.id

            return (
              <Card
                key={prompt.id}
                className={`cursor-pointer transition-all duration-200 ${prompt.color} ${
                  isSelected ? 'ring-2 ring-blue-500 border-blue-300' : ''
                }`}
                onClick={() => handlePromptSelect(prompt)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5 text-gray-700" />
                      <Badge variant="secondary" className="text-xs">
                        {prompt.category}
                      </Badge>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {prompt.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isCustomMode
              ? 'Ou descreva seu próprio estilo'
              : 'Estilo Selecionado'}
          </h2>
          <span className="text-sm text-muted-foreground">
            {customPrompt.length}/500 caracteres
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium px-2">
            Máximo de Playlists
          </label>
          <Select
            value={maxPlaylists.toString()}
            onValueChange={(value) => setMaxPlaylists(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o máximo de playlists" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Playlist' : 'Playlists'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Textarea
            id="prompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={
              isCustomMode
                ? 'Descreva como você quer que suas playlists sejam organizadas...'
                : 'Seu estilo selecionado aparecerá aqui, ou escreva o seu próprio...'
            }
            className="min-h-[120px] text-base resize-none border-2 focus:border-green-500 transition-colors"
            maxLength={500}
          />
          {customPrompt.length === 0 && (
            <div className="absolute bottom-4 left-4 text-sm text-muted-foreground">
              💡 Dica: Seja específico sobre como quer organizar para melhores
              resultados
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {selectedPrompt && !isCustomMode && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Using:{' '}
                {predefinedPrompts.find((p) => p.id === selectedPrompt)?.title}
              </span>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="max-md:w-full"
            size={'xl'}
            disabled={!customPrompt.trim() || isLoading}
          >
            <Send className="w-4 h-4 mr-2" />
            Criar Playlist organizada
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Fique tranquilo, não editamos suas playlists existentes. Apenas
          criamos novas com base no estilo escolhido.
        </p>
      </div>
    </div>
  )
}
