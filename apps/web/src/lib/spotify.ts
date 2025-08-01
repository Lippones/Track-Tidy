export async function spotifyFetch<JSON>(
  input: string,
  options?: RequestInit
): Promise<JSON> {
  const url = new URL('https://api.spotify.com/v1' + input)

  console.log('Fetching Spotify API:', url.toString())

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })

  if (!response.ok) {
    const json = await response.json()
    console.error('Spotify API Error:', json)

    throw new Error(
      json.error || `An unexpected error occurred: ${response.statusText}`
    )
  }

  return response.json()
}
