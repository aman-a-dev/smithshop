import type { Metadata } from 'next'
import ProductsContent from './_components/products-content'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="mt-28 pb-16 flex items-center justify-center min-h-64">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index}>
              <Skeleton className='h-40 w-[95%]' />
            </div>
          ))}
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