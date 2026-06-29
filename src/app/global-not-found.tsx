import './globals.css'
import { hulkFont } from '@/fonts/font'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
   title: 'Not Found',
   description: 'The page you are looking for does not exist.'
}

export default function GlobalNotFound() {
   return (
      <html
         lang="en"
         className={hulkFont.className}>
         <body>
            <div className="flex min-h-screen items-center justify-center">
               <div className="text-center">
                  <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                     Not Found
                  </h1>
                  <p className="leading-7 [&:not(:first-child)]:mt-6 text-center text-muted-foreground">
                     The page you are looking for does not exist.
                  </p>
                  <Link href="/">
                     <Button>Back to Home</Button>
                  </Link>
               </div>
            </div>
         </body>
      </html>
   )
}
