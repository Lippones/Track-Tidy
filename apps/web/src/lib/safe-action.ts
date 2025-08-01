import { getSession } from '@/actions/get-session'
import { createSafeActionClient } from 'next-safe-action'

export const actionClient = createSafeActionClient()

export const authActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const session = await getSession()

    if (!session) {
      throw new Error('Unauthorized')
    }

    return next({
      ctx: {
        user: session.user
      }
    })
  }
)
