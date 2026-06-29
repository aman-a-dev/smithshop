import type { Metadata } from 'next'
import ProductsContent from './_components/products-content'
import { Suspense } from 'react'


export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="mt-28 pb-16 flex items-center justify-center min-h-64">
          <div className="animate-pulse text-muted-foreground text-sm">Loading…</div>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}

export const metadata: Metadata = {
  title: "Products | SmithShop",
  description:
    "Browse our catalogue of game top‑ups, VPN subscriptions, and premium digital services – all at great prices.",
  keywords: [
    "game topup",
    "vpn",
    "digital products",
    "social media premium",
    "game account",
    "smithshop",
  ],
};