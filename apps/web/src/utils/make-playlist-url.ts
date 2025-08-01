export function makePlaylistUrl(playlistId: string) {
  const spotifyBaseUrl = 'https://open.spotify.com/playlist'

  return `${spotifyBaseUrl}/${playlistId}`
}
