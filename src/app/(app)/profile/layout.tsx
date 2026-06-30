import type { Metadata } from 'next'

export default function CartLayout({
   children
}: {
   children: React.ReactNode
}) {
   return <>{children}</>
}

export const metadata: Metadata = {
   title: 'Profile | SmithShop',
   description:
      'Manage your account details, payment methods, and subscription preferences.',
   keywords: ['profile', 'account settings', 'user', 'game topup account']
}
