import type { Metadata } from 'next'

export default function FavouritesLayout({
   children
}: {
   children: React.ReactNode
}) {
   return <>{children}</>
}

export const metadata: Metadata = {
   title: 'Favourites | SmithShop',
   description:
      'Your saved products – game top‑ups, VPNs, and subscriptions you love.',
   keywords: ['favourites', 'wishlist', 'saved items', 'game topup wishlist']
}
