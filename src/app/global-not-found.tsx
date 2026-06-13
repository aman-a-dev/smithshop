import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { hulkFont } from '@/fonts/font'


export const metadata: Metadata = {
   title: 'Not Found',
   description: 'The page you are looking for does not exist.'
}

export default function GlobalNotFound() {
   return (
      <html lang='en'>
         <body>
            <div>
               <h1 className={`${hulkFont.className} scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance`}>
                  Not Found
               </h1>
               <p className='leading-7 [&:not(:first-child)]:mt-6 text-center text-muted-foreground'>
                  The page you are looking for does not exist.
               </p>
               <Link href='/'>
                  <Button>Back to Home</Button>
               </Link>
            </div>
         </body>
      </html>
   )
}
