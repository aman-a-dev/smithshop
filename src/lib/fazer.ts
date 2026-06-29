import { FazerCardsClient } from 'fazercards'

export const fz = new FazerCardsClient({
   apiKey: process.env.FAZER_API_KEY!
})
