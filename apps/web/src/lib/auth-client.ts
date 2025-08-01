import { createAuthClient, inferAdditionalFields } from '@workspace/auth/react'

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields({
      user: {
        slug: {
          type: 'string',
          required: true
        }
      }
    })
  ]
})
