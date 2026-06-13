import { ReactNode } from 'react'
import { TextEffect } from '@/components/ui/core/text-effect'
import { hulkFont } from '@/fonts/font'
import { Badge } from '@/components/ui/budge'

type OpeningProps = {
   heading: string
   paragraph: string
   children?: ReactNode
}

export function Opening({ heading, paragraph, children }: OpeningProps) {
   return (
      <section className='flex justify-center items-center'>
         <div className='border border-2 border-border flex text-center justify-center items-center flex-col py-5 px-3 max-w-3xl my-5 mx-3 rounded'>
            <h1
               className={`${hulkFont.className} scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance`}
            >
               {heading}
            </h1>
            <p className='text-muted-foreground text-sm w-[75%]'>{paragraph}</p>
            {children}
         </div>
      </section>
   )
}
