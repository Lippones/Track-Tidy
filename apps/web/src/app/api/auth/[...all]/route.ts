import { auth } from '@workspace/auth'
import { toNextJsHandler } from '@workspace/auth/next'

export const { POST, GET } = toNextJsHandler(auth)
