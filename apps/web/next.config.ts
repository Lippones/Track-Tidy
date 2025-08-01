import type { NextConfig } from 'next'
// @ts-expect-error ?????????
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

const nextConfig: NextConfig = {
  transpilePackages: ['@workspace/ui'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.spotifycdn.com'
      },
      {
        protocol: 'https',
        hostname: '*.scdn.co'
      }
    ]
  }
}

export default nextConfig
