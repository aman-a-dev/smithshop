'use client'


import { useFavorites } from '@/providers/favourites-context'
import { productsList } from '@/data/products-list'
import { ProductCard } from '@/components/registries/product-card'
import { mapItemToCardProps } from '@/utils/product'
import { Button } from '@/components/ui/button'
import { HeartIcon } from 'lucide-react'
import { Intro } from '@/components/shared/intro'
import Link from 'next/link'

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
         <Intro
            heading="No favourites yet"
            paragraph="Start adding products you love. They will appear here."
            badge="Favourites"
            icon={
               <HeartIcon
                  className="h-16 w-16 text-muted-foreground/40"
                  strokeWidth={1.5}
               />
            }
            className="mt-30">
            <div className="flex flex-col items-center gap-4">
               <Button className="mt-2">
                  <Link href="/products">Browse products</Link>
               </Button>
            </div>
         </Intro>
      )
   }

   return (
      <main className="container mx-auto px-4 py-8 mt-20">
         <Intro
            heading="Your favourites"
            paragraph="Your bookmarked products 🛍"
            badge="Favourites">
            <p className="text-muted-foreground mt-1">
               {favouriteProducts.length} item
               {favouriteProducts.length !== 1 && 's'}
            </p>
         </Intro>

         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
