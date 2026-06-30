import type { Metadata } from 'next'

export default function CartLayout({
   children
}: {
   children: React.ReactNode
}) {
   return <>{children}</>
}

export const metadata: Metadata = {
   title: 'Shopping Cart | SmithShop',
   description:
      'Review your selected game top‑ups, VPN plans, and subscriptions before checkout.',
   keywords: ['cart', 'shopping cart', 'game topup cart', 'checkout']
}
