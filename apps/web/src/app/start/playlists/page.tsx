import { auth } from '@workspace/auth'
import { headers } from 'next/headers'
import { fetchUserPlaylists } from '@/services/spotify'
import { SelectPlaylistsForm } from '@/components/start/select-playlists-form'

export default async function PlaylistsStep() {
  const session = await auth.api.getAccessToken({
    headers: await headers(),
    body: {
      providerId: 'spotify'
    }
  })

  const playlists = await fetchUserPlaylists(session.accessToken)

  return (
    <div className="w-full flex flex-col justify-center items-center gap-10">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Selecione suas playlists</h1>

        <p className="text-sm text-muted-foreground">
          Esta é a segunda etapa. Selecione as playlists que você deseja
          analisar, limpar ou organizar.
        </p>
      </div>

      <SelectPlaylistsForm playlists={playlists} />

      <p className="text-xs text-muted-foreground">
        Fique tranquilo, não vamos coletar nenhuma informação sensível sua.
      </p>
    </div>
  )
}
