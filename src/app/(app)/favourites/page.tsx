// app/favourites/page.tsx
'use client'

import { useFavorites } from '@/providers/favourites-context'
import { productsList } from '@/data/products-list'
import { ProductCard } from '@/components/registries/product-card'
import { mapItemToCardProps } from '@/utils/product'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { HeartIcon } from 'lucide-react' // or any empty heart icon

export default function FavouritesPage() {
   const { favourites } = useFavorites()

   // Build a map of product id → card props
   const productMap = new Map()
   for (const category of productsList.categories) {
      for (const group of category.products) {
         for (let idx = 0; idx < group.items.length; idx++) {
            const item = group.items[idx]
            const cardProps = mapItemToCardProps(
               item,
               group.type,
               category.id,
               idx
            )
            productMap.set(cardProps.id, cardProps)
         }
      }
   }

   const favouriteProducts = favourites
      .map(id => productMap.get(id))
      .filter(Boolean) // remove any undefined (e.g. product deleted)

   if (favouriteProducts.length === 0) {
      return (
         <main className='container mx-auto px-4 py-16 mt-20 text-center'>
            <div className='flex flex-col items-center gap-4'>
               <HeartIcon
                  className='h-16 w-16 text-muted-foreground/40'
                  strokeWidth={1.5}
               />
               <h1 className='text-3xl font-bold tracking-tight'>
                  No favourites yet
               </h1>
               <p className='text-muted-foreground max-w-md'>
                  Start adding products you love. They will appear here.
               </p>
               <Button
                  
                  className='mt-2'
               >
                  <Link href='/products'>Browse products</Link>
               </Button>
            </div>
         </main>
      )
   }

   return (
      <main className='container mx-auto px-4 py-8 mt-20'>
         <div className='mb-8 flex items-center justify-between'>
            <div>
               <h1 className='text-3xl font-bold tracking-tight'>
                  Your favourites
               </h1>
               <p className='text-muted-foreground mt-1'>
                  {favouriteProducts.length} item
                  {favouriteProducts.length !== 1 && 's'}
               </p>
            </div>
         </div>

         <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {favouriteProducts.map(props => (
               <ProductCard
                  key={props.id}
                  {...props}
                  onAddToCart={() =>
                     console.log('Added from favourites:', props.title)
                  }
               />
            ))}
         </div>
      </main>
   )
}
