import { createAuthClient } from 'better-auth/react'
import { telegramClient } from 'better-auth-telegram/client'
import { adminClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
   fetchOptions: {
      credentials: 'include'
   },
   plugins: [telegramClient(),adminClient()]
})
