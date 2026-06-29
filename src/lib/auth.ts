import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from '@/lib/prisma'
import { telegram } from 'better-auth-telegram'
import { admin } from 'better-auth/plugins'

export const auth = betterAuth({
   database: prismaAdapter(prisma, {
      provider: 'postgresql'
   }),
   baseURL: process.env.BETTER_AUTH_URL,
   socialProviders: {
      google: {
         clientId: process.env.GOOGLE_CLIENT_ID as string, // [!code highlight]
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string // [!code highlight]
      }
   },
   plugins: [
      telegram({
         botToken: process.env.TELEGRAM_BOT_TOKEN!,
         botUsername: 'smithtopupbot' // without @
      }),
      admin(),
   ]
})
