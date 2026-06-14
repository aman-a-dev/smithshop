'use client'

import { productsList } from '@/data/products-list'
import { ProductCard } from '@/components/registries/product-card'
import { Opening } from '@/components/shared/opening'
import { mapItemToCardProps } from '@/utils/product'

export default function ProductsPage() {
   return (
      <main className='mt-30'>
         <Opening
            heading='Our Products'
            paragraph='Explore our products from gaming to social media.'
         />

         {productsList.categories.map(category => (
            <section
               key={category.id}
               className='mb-12'
            >
               <h2 className='text-2xl font-bold mb-4 px-2'>{category.name}</h2>

               <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 mx-2'>
                  {category.products.flatMap(group =>
                     group.items.map((item, idx) => {
                        const cardProps = mapItemToCardProps(
                           item,
                           group.type,
                           category.id,
                           idx
                        )
                        return (
                           <ProductCard
                              key={cardProps.id}
                              {...cardProps}
                              onAddToCart={() =>
                                 console.log('Added:', cardProps.title)
                              }
                           />
                        )
                     })
                  )}
               </div>
            </section>
         ))}
      </main>
   )
}
