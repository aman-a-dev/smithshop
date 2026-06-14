'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import Image from 'next/image'

interface ProductInfo {
  id: string
  title: string
  price: number
  originalPrice?: number
  currency: string
  image: string
  subtitle?: string
  rating?: number
  badge?: string
  type?: string
}

interface InfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductInfo
}

export function InfoModal({ open, onOpenChange, product }: InfoModalProps) {
  const hasDiscount =
    product.originalPrice !== undefined && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{product.title}</DialogTitle>
          <DialogDescription>
            {product.subtitle || 'Product details'}
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='relative h-48 w-full overflow-hidden rounded-lg'>
            <Image
              src={product.image}
              alt={product.title}
              fill
              className='object-cover'
            />
          </div>
          <div className='space-y-2'>
            {product.type && (
              <p className='text-sm text-muted-foreground'>Type: {product.type}</p>
            )}
            <div className='flex items-baseline gap-2'>
              <span className='text-2xl font-bold'>
                {product.currency} {product.price}
              </span>
              {hasDiscount && (
                <>
                  <span className='text-muted-foreground line-through'>
                    {product.currency} {product.originalPrice}
                  </span>
                  <span className='text-red-500 text-sm'>-{discountPercent}%</span>
                </>
              )}
            </div>
            {product.rating !== undefined && (
              <p className='text-sm'>⭐ {product.rating} / 5</p>
            )}
            {product.badge && (
              <span className='inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold'>
                {product.badge}
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}