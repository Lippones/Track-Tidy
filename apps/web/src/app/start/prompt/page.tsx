import { PromptSelector } from '@/components/start/prompt-selector'
import { auth } from '@workspace/auth'
import { headers } from 'next/headers'

export default async function PromptStep() {
  // Force refresh token
  await auth.api.getAccessToken({
    headers: await headers(),
    body: {
      providerId: 'spotify'
    }
  })

  return (
    <div className="w-full flex flex-col justify-center items-center gap-10 md:px-12">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          Como você quer organizar suas playlists?
        </h1>

        <p className="text-sm text-muted-foreground">
          Escolha uma das opções predefinidas abaixo ou descreva como você
          gostaria que a IA organizasse suas playlists do Spotify.
        </p>
      </div>

      <PromptSelector />
    </div>
  )
}
