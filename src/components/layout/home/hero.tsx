'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { hulkFont } from '@/fonts/font'
import { BounceCards } from '@/components/registries/bounce-cards'
import { TextEffect } from '@/components/registries/text-effect'

const images = [
   '/assets/ff.png',
   '/assets/tg.png',
   '/assets/bs.png',
   '/assets/cd.png',
   '/assets/pg.png'
]

const transformStyles = [
   'rotate(5deg) translate(-150px)',
   'rotate(0deg) translate(-70px)',
   'rotate(-5deg)',
   'rotate(5deg) translate(70px)',
   'rotate(-5deg) translate(150px)'
]

export default function Hero() {
   return (
      <section className='container mx-auto px-6 py-12 md:py-20 flex flex-col items-center gap-16 min-h-[90vh] justify-center'>
         {/* TOP SECTION: Heading and Search */}
         <div className='w-full flex flex-col md:flex-row md:items-end justify-between gap-10'>
            {/* Modernized Heading */}
            <div className='flex-1 text-center md:text-left space-y-4'>
               <TextEffect
                  preset='fade-in-blur'
                  speedReveal={1.1}
                  speedSegment={0.3}
                  className={`${hulkFont.className} scroll-m-20 text-4xl md:text-6xl font-extrabold tracking-tight text-balance leading-[1.1]`}
               >
                  Level up your digital arsenal
               </TextEffect>
               <p className='max-w-[500px] mx-auto md:mx-0 text-muted-foreground text-base md:text-lg font-medium opacity-80'>
                  Ethiopia’s most secure marketplace for instant{' '}
                  <b className='font-[cursive] text-foreground'>gaming</b>{' '}
                  top-ups and{' '}
                  <b className='font-[cursive] text-foreground'>Social media</b>{' '}
                  premium subscriptions.
               </p>
            </div>

            {/* Search & Buttons Group */}
            <div className='flex flex-col items-center md:items-start gap-5 w-full md:w-auto'>
               <HeroSearch />

               <div className='flex flex-wrap items-center justify-center md:justify-end gap-2'>
                  <Button
                     variant='outline'
                     size='sm'
                     className='rounded-full px-4 hover:bg-primary hover:text-primary-foreground transition-colors'
                  >
                     Freefire
                  </Button>
                  <Button
                     variant='outline'
                     size='sm'
                     className='rounded-full px-4 hover:bg-primary hover:text-primary-foreground transition-colors'
                  >
                     PUBG UC
                  </Button>
                  <Button
                     variant='outline'
                     size='sm'
                     className='rounded-full px-4 hover:bg-primary hover:text-primary-foreground transition-colors'
                  >
                     Telegram
                  </Button>
               </div>
            </div>
         </div>

         {/* BOTTOM SECTION: Centered Bounce Card */}
         <div className='w-screen flex justify-center items-center overflow-scroll py-12'>
            <div className='relative left-10 flex justify-center items-center w-full max-w-[500px] transform transition-transform duration-500'>
               <BounceCards
                  className='custom-bounceCards'
                  images={images}
                  containerWidth={500}
                  containerHeight={250}
                  animationDelay={1}
                  animationStagger={0.08}
                  easeType='elastic.out(1, 0.5)'
                  transformStyles={transformStyles}
                  enableHover
               />
            </div>
         </div>
      </section>
   )
}
import { useRouter, useSearchParams } from 'next/navigation'
import {
   useCallback,
   useEffect,
   useState,
   useTransition,
   useRef,
   FormEvent
} from 'react'
import { Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'

// --------------------------------------------------------------
// Custom debounce hook
// --------------------------------------------------------------
function useDebouncedCallback<T extends (...args: any[]) => any>(
   callback: T,
   delay: number
): T & { cancel: () => void } {
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

   const debouncedCallback = useCallback(
      (...args: Parameters<T>) => {
         if (timeoutRef.current) clearTimeout(timeoutRef.current)
         timeoutRef.current = setTimeout(() => {
            callback(...args)
            timeoutRef.current = null
         }, delay)
      },
      [callback, delay]
   ) as T & { cancel: () => void }

   debouncedCallback.cancel = useCallback(() => {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current)
         timeoutRef.current = null
      }
   }, [])

   return debouncedCallback
}

// --------------------------------------------------------------
// HeroSearch Component
// --------------------------------------------------------------
export function HeroSearch() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const [isPending, startTransition] = useTransition()
   const [query, setQuery] = useState(searchParams.get('q') ?? '')
   const inputRef = useRef<HTMLInputElement>(null)

   // Function to update URL immediately (without debounce)
   const updateUrlImmediately = useCallback(
      (value: string) => {
         startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
               params.set('q', value)
            } else {
               params.delete('q')
            }
            router.push(`?${params.toString()}`, { scroll: false })
         })
      },
      [router, searchParams]
   )

   // Debounced version for typing
   const updateUrlDebounced = useDebouncedCallback((value: string) => {
      updateUrlImmediately(value)
   }, 300) // smoother: 300ms

   // Sync local state when URL changes (back/forward)
   useEffect(() => {
      const urlQuery = searchParams.get('q') ?? ''
      if (urlQuery !== query) {
         setQuery(urlQuery)
      }
   }, [searchParams, query])

   // Cleanup debounce on unmount
   useEffect(() => {
      return () => {
         updateUrlDebounced.cancel()
      }
   }, [updateUrlDebounced])

   // Handle input change – debounced URL update
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setQuery(newValue)
      updateUrlDebounced(newValue)
   }

   // Immediate search (on Enter or button click)
   const handleImmediateSearch = () => {
      updateUrlDebounced.cancel() // cancel any pending debounce
      updateUrlImmediately(query) // update URL now
      inputRef.current?.blur() // optional: blur after search
   }

   // Handle form submit (Enter key)
   const handleSubmit = (e: FormEvent) => {
      e.preventDefault()
      handleImmediateSearch()
   }

   // Clear search
   const clearSearch = () => {
      updateUrlDebounced.cancel()
      setQuery('')
      updateUrlImmediately('')
      inputRef.current?.focus()
   }

   return (
      <form
         onSubmit={handleSubmit}
         className='w-full md:w-[500px] lg:w-[560px]'
      >
         <div className='relative flex items-center group'>
            <Input
               ref={inputRef}
               id='hero-search-input'
               type='search'
               value={query}
               onChange={handleChange}
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

            {/* Clear button */}
            {query && (
               <button
                  type='button'
                  onClick={clearSearch}
                  className='absolute right-16 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors'
                  aria-label='Clear search'
               >
                  <X className='h-4 w-4' />
               </button>
            )}

            {/* Search button - triggers immediate search */}
            <div className='absolute right-2'>
               <Button
                  type='submit'
                  size='icon'
                  className='h-10 w-10 rounded-xl shadow-md bg-primary hover:bg-primary/90 transition-all'
                  disabled={isPending}
                  aria-label='Search'
               >
                  {isPending ? (
                     <div className='h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent' />
                  ) : (
                     <Search className='h-5 w-5' />
                  )}
               </Button>
            </div>
         </div>
      </form>
   )
}
