import type { Metadata } from 'next'
import NavBar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'

export default function MarketingLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (<>
    <NavBar />
    <main className='my-24'>
      {children}
    </main>
    <Footer />
  </>
  )
}


export const metadata: Metadata = {
  title: 'Smithshop',
  description: 'Gaming and Social media marketplace'
}
