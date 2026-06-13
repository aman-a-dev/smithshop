import type { Metadata } from 'next'
import NavBar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'

export default function MarketingLayout({
   children
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <>
         <NavBar />
         {children}
         <Footer />
      </>
   )
}
