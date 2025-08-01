import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    SPOTIFY_CLIENT_ID: z.string(),
    SPOTIFY_CLIENT_SECRET: z.string(),
    TRIGGER_SECRET_KEY: z.string(),
    TRIGGER_API_URL: z.string().url(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string()
  },
  client: {},
  experimental__runtimeEnv: process.env as Record<string, string>,
  emptyStringAsUndefined: true
})
