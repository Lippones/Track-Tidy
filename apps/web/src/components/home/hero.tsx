import { Button } from '@workspace/ui/components/button'
import { AvatarCircles } from '@workspace/ui/components/magicui/avatar-circles'
import { MoveUpRight } from 'lucide-react'
import { SongsCloud } from './songs-cloud'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="py-32">
      <div className="container w-full px-8 mt-4 flex flex-col items-center justify-center gap-4 overflow-hidden text-left xl:mt-14 xl:flex-row xl:overflow-visible mx-auto">
        <div className="w-full space-y-10 xl:w-1/2">
          <div>
            <AvatarCircles
              numPeople={3}
              avatarUrls={[
                {
                  imageUrl:
                    'https://avatars.githubusercontent.com/u/34816616?v=4',
                  profileUrl:
                    'https://avatars.githubusercontent.com/u/34816616?v=4'
                },
                {
                  imageUrl:
                    'https://avatars.githubusercontent.com/u/94140750?v=4',
                  profileUrl:
                    'https://avatars.githubusercontent.com/u/94140750?v=4'
                },
                {
                  imageUrl:
                    'https://avatars.githubusercontent.com/u/101940354?v=4',
                  profileUrl:
                    'https://avatars.githubusercontent.com/u/101940354?v=4'
                },
                {
                  imageUrl:
                    'https://avatars.githubusercontent.com/u/77363934?v=4',
                  profileUrl:
                    'https://avatars.githubusercontent.com/u/77363934?v=4'
                }
              ]}
            />
          </div>

          <h1 className="text-foreground mt-12 text-5xl font-medium tracking-tight md:text-7xl">
            Deixe a IA Organizar
            <br />
            Suas Playlists do Spotify
          </h1>

          <p className="text-muted-foreground/80 mt-3 max-w-lg">
            Selecione suas playlists ou suas músicas curtidas, escreva como
            deseja o mix e receba listas inteligentes criadas em segundos.
          </p>

          <div>
            <Button size={'xl'} asChild>
              <Link href="/start">
                Comece de Graça <MoveUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="h-145 relative mt-36 w-full xl:mt-0 xl:w-3/5 flex items-center justify-center">
          <SongsCloud />
        </div>
      </div>
    </section>
  )
}
