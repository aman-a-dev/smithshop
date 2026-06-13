import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html
         lang='en'
         className={`h-full antialiased`}
         suppressHydrationWarning
      >
         <body className='min-h-full flex flex-col font-sans'>
            <ThemeProvider
               attribute='class'
               defaultTheme='system'
               enableSystem
            >
               <Toaster />
               {children}
              
            </ThemeProvider>
         </body>
      </html>
   )
}

export const metadata: Metadata = {
   title: 'Smithshop',
   description: 'Gaming and Social media marketplace'
}
