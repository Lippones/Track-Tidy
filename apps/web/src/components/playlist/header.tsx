'use client'
import Image from 'next/image'
import Link from 'next/link'
import { HeaderAvatar } from './header-avatar'
import { authClient } from '@/lib/auth-client'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { BuyCreditsDialog } from '../buy-credits-dialog'
import { useQuery } from '@tanstack/react-query'
import { getCreditsBalance } from '@/actions/get-credit-balance'
import { Badge } from '@workspace/ui/components/badge'

export function Header() {
  const { data, isPending } = authClient.useSession()

  const { data: balance, isLoading: balanceIsLoading } = useQuery({
    queryKey: ['credits-balance'],
    queryFn: async () => {
      const { data, serverError, validationErrors } = await getCreditsBalance()
      if (serverError || validationErrors || !data) {
        throw new Error('Failed to fetch credit balance')
      }

      return data
    }
  })

  return (
    <header className="bg-secondary/80">
      <div className="container mx-auto flex items-center justify-between p-4 border-b h-20">
        <div className="flex items-center space-x-4 h-full">
          <Link href="/playlists" className="flex items-center">
            <Image src={'/logo.svg'} width={100} height={100} alt="TrackTidy" />
            <span className="sr-only">TrackTidy</span>
          </Link>
        </div>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <BuyCreditsDialog>
                {balanceIsLoading ? (
                  <Skeleton className="h-6 w-20 rounded-md bg-primary/30 shrink-0" />
                ) : (
                  <button>
                    <Badge className="py-1 px-4 bg-background rounded-lg border border-primary/20 flex items-center space-x-2 text-center text-xs text-foreground">
                      Credits:
                      <span className="ml-2">{balance ?? 0}</span>
                    </Badge>
                  </button>
                )}
              </BuyCreditsDialog>
            </li>
            <div className="h-8 bg-primary/20 w-px" />
            <li>
              {isPending ? (
                <Skeleton className="size-10 rounded-full bg-primary/30 shrink-0" />
              ) : (
                <HeaderAvatar
                  avatarUrl={data?.user.image ?? ''}
                  userName={data?.user?.name ?? ''}
                />
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
