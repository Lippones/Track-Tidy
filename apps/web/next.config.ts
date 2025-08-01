import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@workspace/ui'],
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
