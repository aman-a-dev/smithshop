import type { Metadata } from 'next'
import Hero from '@/components/layout/home/hero'
import ShowCase from '@/components/layout/home/showcase'
import Cta from '@/components/layout/home/cta'

export default function Home() {
   return (
      <main className='my-24'>
         <Hero />
         <ShowCase />
         <Cta />
      </main>
   )
}

export const metadata: Metadata = {
  title: "SmithShop – Game Top‑ups, VPN & Digital Subscriptions",
  description:
    "Buy game top‑ups, VPN plans, and premium social media subscriptions at the best prices. Fast delivery, secure payments.",
  keywords: [
    "game topup",
    "vpn subscription",
    "social media premium",
    "game account seller",
    "digital products",
    "smithshop",
  ],
};