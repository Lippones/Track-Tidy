import { auth } from '@workspace/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { LoginSpotify } from '@/components/start/login-spotify'

export default async function StartPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) {
    redirect('/start/playlists')
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-10 md:px-12">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Bem-vindo, vamos começar!</h1>

        <p className="text-sm text-muted-foreground">
          Esta é a primeira etapa. Faça login no spotify para selecionar usas
          playlists.
        </p>
      </div>

      <LoginSpotify />

      <p className="text-xs text-muted-foreground">
        Fique tranquilo, não vamos coletar nenhuma informação sensível sua.
      </p>
    </div>
  )
}
