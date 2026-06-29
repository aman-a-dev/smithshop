'use client'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Heart, Zap, ShoppingCart, Info, Flag } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { ProductItem } from './products-content'
import { Button } from '@/components/ui/button'

export function PackCard({
   product,
   index,
   faved,
   carted,
   onAddToCart,
   onBuyNow,
   onFavourite,
   onReport,
   onInfo
}: {
   product: ProductItem
   index: number
   faved: boolean
   carted: boolean
   onAddToCart: () => void
   onBuyNow: () => void
   onFavourite: () => void
   onReport: () => void
   onInfo: () => void
}) {
   const tilt = index % 3 === 0 ? -3 : index % 3 === 2 ? 3 : 0

   return (
      <div className="flex flex-col items-center gap-3 w-44">
         <motion.div
            className="w-44 rounded-2xl border border-border/50 shadow-xl overflow-hidden bg-card"
            animate={{ rotate: tilt }}
            whileHover={{ rotate: 0, scale: 1.02, y: -2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
            <div className="relative">
               <Image
                  src={product.image}
                  alt={product.title}
                  width={176}
                  height={132}
                  className="w-full h-32 object-cover"
               />
               <button
                  onClick={onFavourite}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
                  <Heart
                     className={cn(
                        'w-4 h-4 transition-colors',
                        faved ? 'fill-rose-500 text-rose-500' : 'text-white'
                     )}
                  />
               </button>
            </div>
            <div className="p-2.5">
               {product.badge && (
                  <Badge
                     variant="secondary"
                     className="text-[9px] px-1 py-0 mb-1">
                     {product.badge}
                  </Badge>
               )}
               <p className="text-xs font-semibold truncate">{product.title}</p>
               {product.subtitle && (
                  <p className="text-[10px] text-muted-foreground truncate capitalize mt-0.5">
                     {product.subtitle}
                  </p>
               )}
               <p className="text-xs font-bold text-primary mt-1">
                  {product.currency || 'ETB'} {product.price.toLocaleString()}
               </p>
            </div>
         </motion.div>
         <div className="flex flex-col gap-1.5 w-full">
            <Button
               className="w-full gap-1.5 text-xs h-8"
               size="sm"
               onClick={onBuyNow}>
               <Zap className="w-3.5 h-3.5" /> Buy Now
            </Button>
            <Button
               variant="outline"
               className="w-full gap-1.5 text-xs h-8"
               size="sm"
               onClick={onAddToCart}>
               <ShoppingCart className="w-3.5 h-3.5" />{carted ? "In cart" :  'Add to Cart'}
            </Button>
            <div className="flex justify-center gap-2 pt-0.5">
               <button
                  onClick={onInfo}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                  title="Product info">
                  <Info className="w-4 h-4 text-muted-foreground" />
               </button>
               <button
                  onClick={onReport}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                  title="Report">
                  <Flag className="w-4 h-4 text-muted-foreground" />
               </button>
            </div>
         </div>
      </div>
   )
}
