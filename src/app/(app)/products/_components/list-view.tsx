"use client"
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  ShoppingCart,
  Heart,
  Info,
  Flag,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductItem } from './products-content'
import { Button } from '@/components/ui/button'

export function HorizontalProductCard({
  product,
  faved,
  onAddToCart,
  onBuyNow,
  onFavourite,
  onReport,
  onInfo,
}: {
  product: ProductItem
  faved: boolean
  onAddToCart: () => void
  onBuyNow: () => void
  onFavourite: () => void
  onReport: () => void
  onInfo: () => void
}) {
  return (
    <div className="flex flex-row items-center gap-3 rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow p-3 w-full">
      <div className="shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden bg-muted">
        <Image src={product.image} alt={product.title} width={72} height={72} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        {product.badge && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mb-0.5">{product.badge}</Badge>
        )}
        <p className="font-semibold text-sm text-foreground truncate">{product.title}</p>
        {product.subtitle && (
          <p className="text-xs text-muted-foreground truncate capitalize">{product.subtitle}</p>
        )}
        <p className="text-sm font-bold text-primary mt-0.5">
          {product.currency || 'ETB'} {product.price.toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col gap-2 shrink-0 items-end">
        <div className="flex gap-1.5">
          <Button size="sm" className="h-8 text-xs gap-1 px-2.5" onClick={onBuyNow}>
            <Zap className="w-3.5 h-3.5" /><span className="hidden xs:inline">Buy</span>
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1 px-2.5" onClick={onAddToCart}>
            <ShoppingCart className="w-3.5 h-3.5" /><span className="hidden xs:inline">Cart</span>
          </Button>
        </div>
        <div className="flex gap-0.5">
          <button onClick={onFavourite} className="p-1.5 rounded-full hover:bg-muted transition-colors" title="Favourite">
            <Heart className={cn('w-3.5 h-3.5 transition-colors', faved ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground')} />
          </button>
          <button onClick={onInfo} className="p-1.5 rounded-full hover:bg-muted transition-colors" title="Product info">
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button onClick={onReport} className="p-1.5 rounded-full hover:bg-muted transition-colors" title="Report">
            <Flag className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}