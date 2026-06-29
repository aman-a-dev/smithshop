import { ArrowBigRightDash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Cta() {
   return (
      <section className='flex min-h-svh w-full items-center justify-center bg-background px-6 py-12 text-foreground'>
         <div className='w-full bg-primary px-8 py-16 sm:px-16 sm:py-20 rounded'>
            <div className='mx-auto flex w-full max-w-5xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between'>
               <div className='flex flex-col gap-3'>
                  <h2 className='text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl'>
                     Shop Your Products
                  </h2>
                  <p className='max-w-xl text-base text-primary-foreground/80'>
                     &#x1F3AE; Instant game top-ups &#x1F48E; &bull; Fast
                     delivery &#x26A1; &bull; Secure payments &#x1F512; &bull;
                     Best prices &#x1F4B0; &bull; 24/7 Support &#x1F4AC;
                  </p>
               </div>
               <div className='shrink-0'>
                  <Button
                     variant='secondary'
                     render={<Link href='/products' />}
                     nativeButton={false}
                     className='w-full sm:w-auto'
                  >
                     Get Started Free
                     <ArrowBigRightDash
                        data-icon='inline-end'
                        aria-hidden='true'
                     />
                  </Button>
               </div>
            </div>
         </div>
      </section>
   )
}
