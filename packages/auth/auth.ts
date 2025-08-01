import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@workspace/prisma'
import { env } from '@workspace/env'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import slugify from 'slugify'
import { spotifyRefreshToken } from './utils/spotify-refresh-token'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  trustedOrigins: [env.BETTER_AUTH_URL],
  user: {
    additionalFields: {
      slug: {
        type: 'string',
        required: true,
        unique: true
      }
    }
  },
  plugins: [
    inferAdditionalFields({
      user: {
        slug: {
          type: 'string',
          required: true,
          unique: true
        }
      }
    })
  ],
  databaseHooks: {
    user: {
      create: {
        async before(user, context) {
          const slug = slugify(user.name, {
            lower: true,
            strict: true,
            trim: true
          })

          return {
            data: {
              ...user,
              slug
            }
          }
        }
      }
    }
  },
  socialProviders: {
    spotify: {
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      refreshAccessToken: spotifyRefreshToken,
      scope: [
        'user-read-email',
        'user-read-private',
        'playlist-modify-private',
        'playlist-modify-public',
        'playlist-read-private',
        'playlist-read-collaborative',
        'user-library-read'
      ]
    }
  }
})

export type Session = typeof auth.$Infer.Session
