import { env } from '@workspace/env'

export async function spotifyRefreshToken(refreshToken: string): Promise<{
  accessToken: string
  expiresIn: number
  refreshToken?: string
}> {
  console.log('Refreshing Spotify token...')
  try {
    const basicAuth = Buffer.from(
      `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64')

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    })

    if (!response.ok) {
      throw new Error(`Spotify refresh failed: ${response.statusText}`)
    }

    const data = await response.json()

    console.log('Spotify token refreshed successfully:', data)

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token ?? refreshToken
    }
  } catch (error) {
    console.error('Error refreshing Spotify token:', error)
    throw error
  }
}
