import { z } from 'zod'

export const PlaylistsSchema = z.object({
  playlists: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        tracks: z.array(z.string())
      })
    )
    .max(10)
})

export function makePlaylistsSchema(validIds: string[]) {
  const idSet = new Set(validIds)

  return z.object({
    playlists: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
          tracks: z
            .array(z.string())
            .nonempty('Cada playlist precisa ter ao menos 1 faixa')
        })
      )
      .max(5, 'Excede o número máximo de playlists')
  })
}

export type PlaylistsSchemaType = z.infer<typeof PlaylistsSchema>
