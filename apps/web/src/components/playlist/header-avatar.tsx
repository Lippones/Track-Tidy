'use client'
import { authClient } from '@/lib/auth-client'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@workspace/ui/components/avatar'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from '@workspace/ui/components/dropdown-menu'
import { LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HeaderAvatarProps {
  avatarUrl: string
  userName: string
}

export function HeaderAvatar({ avatarUrl, userName }: HeaderAvatarProps) {
  const router = useRouter()

  function handleSignOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login')
        }
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-10 cursor-pointer">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{userName.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>{userName}</DropdownMenuLabel>
        <DropdownMenuItem
          className="text-xs text-muted-foreground flex items-center gap-2"
          asChild
        >
          <Link href="/settings">
            <Settings /> Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            <LogOut /> Sair
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
