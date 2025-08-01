'use client'
import { authClient } from '@/lib/auth-client'
import { Button } from '@workspace/ui/components/button'

export function Login() {
  return (
    <Button
      onClick={async () => {
        await authClient.signIn.social({
          provider: 'spotify'
        })
      }}
    >
      Login Spot
    </Button>
  )
}
