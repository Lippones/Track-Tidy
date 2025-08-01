'use server'

import { auth } from '@workspace/auth'
import { headers } from 'next/headers'

export async function getSession() {
  return auth.api.getSession({
    headers: await headers()
  })
}
