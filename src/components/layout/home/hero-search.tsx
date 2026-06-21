import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function HeroSearch() {
   return (
      <form className='w-full md:w-[500px] lg:w-[560px]'>
         <div className='relative flex items-center group'>
            <Input
               id='hero-search-input'
               type='text'
               placeholder='Search for diamonds, UC, or coins...'
               className={cn(
                  'pl-5 pr-24 h-14 w-full rounded-2xl',
                  'border-muted-foreground/20 bg-background/80 backdrop-blur-sm',
                  'shadow-lg transition-all duration-200',
                  'focus-visible:ring-2 focus-visible:ring-primary/50',
                  'group-focus-within:border-primary/50 group-focus-within:shadow-xl',
                  'placeholder:text-muted-foreground/60'
               )}
               aria-label='Search products'
            />

            {/* Search button - triggers immediate search */}
               <div className='absolute right-2'>
            <Link href='/products'>
                  <Button
                     type='submit'
                     size='icon'
                     className='h-10 w-10 rounded-xl shadow-md bg-primary hover:bg-primary/90 transition-all'
                     aria-label='Search'
                  >
                     <Search className='h-5 w-5' />
                  </Button>
            </Link>
               </div>
         </div>
      </form>
   )
}
