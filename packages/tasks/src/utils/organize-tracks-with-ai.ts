import { makePlaylistsSchema } from '../schemas/playlist-schema'

import { generateObject, NoObjectGeneratedError } from 'ai'
import { openai } from '@ai-sdk/openai'
import type { TrackInfo } from './get-tracks-from-spotify'

export async function organizeTracksWithAI(
  tracks: TrackInfo[],
  prompt: string
) {
  const uniqueIds = Array.from(new Set(tracks.map((t) => t.id)))

  try {
    const { object } = await generateObject({
      model: openai('o4-mini'),
      schema: makePlaylistsSchema(tracks.map((t) => t.id)),
      prompt: `
      You are a Spotify playlist organizer AI.  
      Your task is to group the given tracks into playlists based exactly on the user's instruction.  

      Instructions:
      1. Use **only** the provided tracks—do not invent or alter any IDs, names, or artists.
      3. If the user's request specifies a single playlist, you **must** output exactly one playlist.  
      4. Create no more than the maximum number of playlists requested by the user.  
      5. Remove duplicates from the tracks in each playlist.

      Example valid response:
      {
        "playlists": [
          {
            "name": "Chill Hits",
            "description": "Músicas relaxantes",
            "tracks": ["123","456"]
          }
        ]
      }

      User's instruction:
      ${prompt}
     
      Tracks summary: ${JSON.stringify(tracks, null, 2)},
    `
    })

    return object
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      console.log('NoObjectGeneratedError')
      console.log('Cause:', error.cause)
      console.log('Text:', error.text)
      console.log('Response:', error.response)
      console.log('Usage:', error.usage)
      console.log('Finish Reason:', error.finishReason)
    }

    throw new Error(
      `Failed to organize tracks with AI: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
