import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import Eruda from '@/components/eruda'

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html
         lang="en"
         className={`h-full antialiased`}
         suppressHydrationWarning>
         <body className="min-h-full flex flex-col font-sans">
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem>
               <Toaster />
               {children}
               <Eruda />
            </ThemeProvider>
         </body>
      </html>
   )
}

export const metadata: Metadata = {
   metadataBase: new URL('https://smithshop.com'), // Replace with your actual domain

   title: 'SmithShop – Game Top‑ups, VPN & Premium Subscriptions',
   description:
      'Buy affordable game top‑ups for Free Fire, PUBG, Roblox, Call of Duty, and more. Get VPN plans, social media followers, and digital subscriptions – all with instant delivery and secure payments.',

   keywords: [
      // Core brand & service
      'smithshop',
      'game topup',
      'game account seller',
      'vpn subscription',
      'social media premium',
      'digital products',

      // Game-specific (from your product list)
      'free fire diamonds',
      'free fire top up',
      'pubg mobile uc',
      'pubg uc top up',
      'telegram stars',
      'telegram premium',
      'efootball coins',
      'tiktok coins',
      'instagram followers',
      'blood strike diamonds',
      'call of duty cp',
      'roblox robux',

      // Category & intent
      'buy game credits',
      'cheap game top up',
      'instant game currency',
      'vpn for gaming',
      'best vpn plans',
      'premium telegram',
      'social media growth',
      'followers for instagram',
      'tiktok coins buy',
      'roblox robux cheap',
      'free fire diamond price',
      'pubg mobile uc price',

      // Long-tail & SEO
      'best site to buy game top up',
      'reliable game account seller',
      'cheapest vpn subscription',
      'buy social media followers',
      'game top up store',
      'digital subscription store',
      'online game currency shop',
      'fast delivery game topup',
      'secure payment game credits',

      // Brand & developer
      'smithshop topup',
      'smithshop games',
      'game store',
      'digital store',

      // General
      'top up',
      'gaming',
      'subscription',
      'premium'
   ].join(', '), // Use comma-separated string (common for SEO)

   authors: [{ name: 'SmithShop Team', url: 'https://smithshop.com/about' }],
   creator: 'SmithShop',
   publisher: 'SmithShop',

   robots: {
      index: true,
      follow: true,
      googleBot: {
         index: true,
         follow: true,
         'max-video-preview': -1,
         'max-image-preview': 'large',
         'max-snippet': -1
      }
   },

   icons: {
      icon: '/favicon.ico' // Adjust to your actual favicon
      // apple: "/apple-touch-icon.png", // optional
   },

   manifest: '/site.webmanifest', // if you have one

   openGraph: {
      title: 'SmithShop – Game Top‑ups, VPN & Premium Subscriptions',
      description:
         'Top up Free Fire, PUBG, Roblox, and more. Get VPN, Telegram Premium, Instagram followers, and digital subscriptions instantly.',
      url: 'https://smithshop.com',
      siteName: 'SmithShop',
      type: 'website',
      images: [
         {
            url: '/og-image.png', // Replace with your actual OG image
            width: 1200,
            height: 630,
            alt: 'SmithShop – Buy Game Top-ups, VPN, and Subscriptions'
         }
      ]
   },

   twitter: {
      card: 'summary_large_image',
      title: 'SmithShop – Game Top‑ups, VPN & Premium Subscriptions',
      description:
         'Top up Free Fire, PUBG, Roblox, and more. Get VPN, Telegram Premium, Instagram followers, and digital subscriptions instantly.',
      images: ['/og-image.png']
      // creator: "@smithshop", // optional, add your Twitter handle
      // site: "@smithshop",
   },

   alternates: {
      canonical: 'https://smithshop.com'
   },

   classification: 'E-commerce, Gaming, Digital Services',

   category: [
      'Game Top-up',
      'VPN Services',
      'Social Media Premium',
      'Digital Subscriptions',
      'Gaming Currency',
      'Instant Delivery',
      'Online Store',
      'Free Fire',
      'PUBG Mobile',
      'Roblox',
      'Call of Duty',
      'Telegram',
      'TikTok',
      'Instagram'
   ].join(', '),

   applicationName: 'SmithShop',

   // Additional meta tags for better search & sharing
   other: {
      'application-name': 'SmithShop',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'SmithShop',
      'msapplication-TileColor': '#000000',
      'theme-color': '#000000',

      'google-site-verification': 'your-verification-code', // add if you have one

      'article:author': 'SmithShop',
      'article:publisher': 'https://smithshop.com/about',
      'article:section': 'Gaming & Digital Services',
      'article:tag': 'Game Topup, VPN, Social Media Premium, Subscriptions',

      'revisit-after': '7 days',
      distribution: 'global',
      rating: 'general',
      copyright: '© 2025 SmithShop. All rights reserved.'
   }
}
