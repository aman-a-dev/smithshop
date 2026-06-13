'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useState } from 'react'
import Image from 'next/image'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
   IconFlag3,
   IconInfoSquareRounded,
   IconDotsVertical,
   IconHeartOff,
   IconHeart,
   IconGardenCart,
   IconShoppingBag
} from '@tabler/icons-react'

export interface ProductCardProps {
   badge?: string
   className?: string
   currency?: string
   image: string
   onAddToCart?: () => void
   onWishlist?: () => void
   originalPrice?: number
   price: number
   rating?: number
   title: string
   subtitle?: string
}

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD
 *
 *    0ms   card enters viewport → fade up + scale
 *  250ms   badge pops in with spring
 *  hover   image zooms 1.05, wishlist heart appears
 *  click   button scale bounce + icon morph to checkmark
 * ───────────────────────────────────────────────────────── */

const SPRING = {
   type: 'spring' as const,
   duration: 0.25,
   bounce: 0.1
}

const SPRING_BOUNCY = {
   type: 'spring' as const,
   duration: 0.3,
   bounce: 0.2
}

const STAR_PATH =
   'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
   const id = useId()

   if (half) {
      const gradientId = `half-star-${id}`
      return (
         <svg
            aria-hidden='true'
            className='h-3.5 w-3.5 text-amber-400'
            viewBox='0 0 24 24'
         >
            <defs>
               <linearGradient id={gradientId}>
                  <stop
                     offset='50%'
                     stopColor='currentColor'
                  />
                  <stop
                     offset='50%'
                     stopColor='transparent'
                  />
               </linearGradient>
            </defs>
            <path
               d={STAR_PATH}
               fill={`url(#${gradientId})`}
               stroke='currentColor'
               strokeLinecap='round'
               strokeLinejoin='round'
               strokeWidth={1.5}
            />
         </svg>
      )
   }

   return (
      <svg
         aria-hidden='true'
         className={cn(
            'h-3.5 w-3.5',
            filled ? 'text-amber-400' : 'text-muted-foreground/30'
         )}
         fill={filled ? 'currentColor' : 'none'}
         stroke='currentColor'
         strokeWidth={filled ? 0 : 1.5}
         viewBox='0 0 24 24'
      >
         <path
            d={STAR_PATH}
            strokeLinecap='round'
            strokeLinejoin='round'
         />
      </svg>
   )
}

function CheckIcon() {
   return (
      <svg
         aria-hidden='true'
         className='h-4 w-4'
         fill='none'
         stroke='currentColor'
         strokeWidth={2.5}
         viewBox='0 0 24 24'
      >
         <path
            d='M5 13l4 4L19 7'
            strokeLinecap='round'
            strokeLinejoin='round'
         />
      </svg>
   )
}

function CartIcon() {
   return (
      <svg
         aria-hidden='true'
         className='h-4 w-4'
         fill='none'
         stroke='currentColor'
         strokeWidth={2}
         viewBox='0 0 24 24'
      >
         <path
            d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
            strokeLinecap='round'
            strokeLinejoin='round'
         />
      </svg>
   )
}

function HeartIcon({ filled }: { filled: boolean }) {
   return (
      <svg
         aria-hidden='true'
         className={cn('h-4 w-4', filled ? 'text-red-500' : 'text-foreground')}
         fill={filled ? 'currentColor' : 'none'}
         stroke='currentColor'
         strokeWidth={filled ? 0 : 2}
         viewBox='0 0 24 24'
      >
         <path
            d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
            strokeLinecap='round'
            strokeLinejoin='round'
         />
      </svg>
   )
}

function RatingStars({ rating, title }: { rating: number; title: string }) {
   const fullStars = Math.floor(rating)
   const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75
   const roundedUp = rating - fullStars >= 0.75

   return (
      <div
         aria-label={`${rating} out of 5 stars`}
         className='flex items-center gap-0.5'
      >
         {Array.from({ length: 5 }, (_, i) => {
            const isFilled = i < fullStars || (roundedUp && i === fullStars)
            const isHalf = hasHalf && i === fullStars
            return (
               <StarIcon
                  filled={isFilled}
                  half={isHalf}
                  key={`star-${title}-${i}`}
               />
            )
         })}
         <span className='ml-1 font-medium text-muted-foreground text-xs'>
            {rating}
         </span>
      </div>
   )
}

export function ProductCard({
   image,
   title,
   price,
   originalPrice,
   currency = 'ETB',
   rating,
   badge,
   onAddToCart,
   onWishlist,
   className,subtitle
}: ProductCardProps) {
   const shouldReduceMotion = useReducedMotion()
   const [isHoverDevice, setIsHoverDevice] = useState(false)
   const [isAdded, setIsAdded] = useState(false)
   const [isWishlisted, setIsWishlisted] = useState(false)

   useEffect(() => {
      const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
      setIsHoverDevice(mediaQuery.matches)
      const handler = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
   }, [])

   const handleAddToCart = () => {
      setIsAdded(true)
      onAddToCart?.()
      setTimeout(() => setIsAdded(false), 2000)
   }

   const handleWishlist = () => {
      setIsWishlisted(prev => !prev)
      onWishlist?.()
   }

   const hasDiscount = originalPrice !== undefined && originalPrice > price
   const discountPercent = hasDiscount
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0

   return (
      <motion.div
         aria-label={`${title} - ${currency}${price}`}
         className={cn(
            'group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm',
            'transition-shadow duration-300',
            isHoverDevice && 'hover:shadow-black/5 hover:shadow-xl',
            className
         )}
         initial={
            shouldReduceMotion
               ? { opacity: 1 }
               : { opacity: 0, transform: 'translateY(20px) scale(0.97)' }
         }
         role='article'
         transition={shouldReduceMotion ? { duration: 0 } : SPRING}
         viewport={{ once: true, margin: '-50px' }}
         whileInView={
            shouldReduceMotion
               ? { opacity: 1 }
               : { opacity: 1, transform: 'translateY(0px) scale(1)' }
         }
      >
         {/* Image — full bleed */}
         <div className='relative  overflow-hidden bg-muted'>
            <Image
               alt={title}
               className={cn(
                  'h-50 w-full object-cover',
                  !shouldReduceMotion &&
                     'transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]',
                  isHoverDevice &&
                     !shouldReduceMotion &&
                     'group-hover:scale-105'
               )}
               src={image}
               width={100}
               height={50}
            />

            {/* Hover overlay gradient */}
            <div
               className={cn(
                  'pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300',
                  isHoverDevice && 'group-hover:opacity-100'
               )}
            />

            {/* Badge */}
            {badge && (
               <motion.span
                  animate={
                     shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, transform: 'scale(1)' }
                  }
                  className={cn(
                     'absolute top-3 left-3 rounded-full px-2.5 py-1 font-semibold text-xs shadow-sm',
                     badge.toLowerCase() === 'sale'
                        ? 'bg-red-500 text-white'
                        : badge.toLowerCase() === 'new'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-primary text-primary-foreground'
                  )}
                  initial={
                     shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, transform: 'scale(0.6)' }
                  }
                  role='status'
                  transition={
                     shouldReduceMotion ? { duration: 0 } : SPRING_BOUNCY
                  }
               >
                  {badge}
               </motion.span>
            )}

            {/* Wishlist button */}
            <motion.button
               aria-label={
                  isWishlisted
                     ? `Remove ${title} from wishlist`
                     : `Add ${title} to wishlist`
               }
               className={cn(
                  'absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isHoverDevice
                     ? 'opacity-0 group-hover:opacity-100'
                     : 'opacity-100'
               )}
               onClick={handleWishlist}
               type='button'
               whileTap={
                  shouldReduceMotion
                     ? undefined
                     : { scale: 0.85, transition: { duration: 0.1 } }
               }
            >
               <HeartIcon filled={isWishlisted} />
            </motion.button>
         </div>

         {/* Content */}
         <div className='flex flex-1 flex-col gap-2 p-4'>
            {subtitle && (
               <p className='text-xs text-muted-foreground line-clamp-1'>
                  {subtitle}
               </p>
            )}
            <h3 className='line-clamp-1 font-semibold text-foreground text-sm tracking-tight'>
               {title}
            </h3>

            {rating !== undefined && (
               <RatingStars
                  rating={rating}
                  title={title}
               />
            )}

            <div className='flex items-baseline gap-2'>
               <span className='font-bold text-foreground text-xl tracking-tight'>
                  {currency} {price}
               </span>
               {hasDiscount && (
                  <>
                     <span className='text-muted-foreground text-sm line-through'>
                        {currency}
                        {originalPrice}
                     </span>
                     <span className='rounded-md bg-red-50 px-1.5 py-0.5 font-semibold text-red-600 text-xs dark:bg-red-950/40 dark:text-red-400'>
                        -{discountPercent}%
                     </span>
                  </>
               )}
            </div>

            <div className='mt-auto pt-2 flex justify-between items-center'>
               <div>
                  <Button>
                     Buy now <IconShoppingBag />
                  </Button>

                  <Button>
                     {isAdded ? <span>Added</span> : <span>Add to cart</span>}
                     <IconGardenCart />
                  </Button>
               </div>
               <DropdownMenu>
                  <DropdownMenuTrigger
                     render={
                        <Button variant='secondary'>
                           <IconDotsVertical />
                        </Button>
                     }
                  />
                  <DropdownMenuContent>
                     <DropdownMenuItem>
                        <IconInfoSquareRounded />
                        Info
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <IconFlag3 />
                        Report
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      </motion.div>
   )
}

// "use client";

// import ProductCard from "@/components/smoothui/components/product-card";

// const products = [
//   {
//     image:
//       "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
//     title: "Nike Air Max",
//     price: 129,
//     originalPrice: 179,
//     rating: 4.5,
//     badge: "Sale",
//   },
//   {
//     image:
//       "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=600&fit=crop",
//     title: "Luxury Perfume",
//     price: 89,
//     rating: 5,
//     badge: "New",
//   },
// ];

// export default function ProductCardDemo() {
//   return (
//     <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-4">
//       {products.map((product) => (
//         <ProductCard key={product.title} onAddToCart={() => {}} {...product} />
//       ))}
//     </div>
//   );
// }
