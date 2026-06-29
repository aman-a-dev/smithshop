'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'motion/react'
import { Search } from 'lucide-react'
import { productsList } from '@/data/products-list'
import { mapItemToCardProps } from '@/utils/product'
import { Intro } from '@/components/shared/intro'
import DiscoverButton from '@/components/registries/discover-button'
import AnimatedCollection, {
   spring
} from '@/components/registries/animated-collection'
import type { ViewMode } from '@/components/registries/animated-collection'
import { ProductCard } from '@/components/registries/product-card'
import { InfoModal } from '@/components/custom/info-modal'
import { ReportModal } from '@/components/custom/report-modal'
import { useCart } from '@/providers/cart-context'
import { useFavorites } from '@/providers/favourites-context'
import { HorizontalProductCard } from '@/app/(app)/products/_components/list-view'
import { PackCard } from '@/app/(app)/products/_components/pack-view'

export type ProductItem = {
   id: string
   title: string
   price: number
   image: string
   badge?: string
   currency?: string
   subtitle?: string
   type?: string
}

export default function ProductsContent() {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const activeCategory =
      searchParams.get('category') || productsList.categories[0]?.id || ''
   const searchQuery = searchParams.get('q') || ''
   const [view, setView] = useState<ViewMode>('grid')
   const cart = useCart()
   const favourites = useFavorites()
   const [infoProduct, setInfoProduct] = useState<ProductItem | null>(null)
   const [reportProduct, setReportProduct] = useState<ProductItem | null>(null)

   const updateParams = useCallback(
      (updates: Record<string, string | null>) => {
         const params = new URLSearchParams(searchParams.toString())
         Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') params.delete(key)
            else params.set(key, value)
         })
         router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      },
      [router, pathname, searchParams]
   )

   const handleCategoryChange = (id: string) =>
      updateParams({ category: id, q: null })
   const handleSearchChange = (q: string) => updateParams({ q: q || null })

   const currentCategory = useMemo(
      () => productsList.categories.find(c => c.id === activeCategory),
      [activeCategory]
   )

   const allProducts = useMemo((): ProductItem[] => {
      if (!currentCategory) return []
      return currentCategory.products.flatMap(group =>
         group.items.map((item, idx) => {
            const cardProps = mapItemToCardProps(
               item,
               group.type,
               currentCategory.id,
               idx
            )
            return { ...cardProps, subtitle: group.type, type: group.type }
         })
      )
   }, [currentCategory])

   const filteredProducts = useMemo(() => {
      const q = searchQuery.toLowerCase().trim()
      if (!q) return allProducts
      return allProducts.filter(
         p =>
            p.title.toLowerCase().includes(q) ||
            p.subtitle?.toLowerCase().includes(q) ||
            p.badge?.toLowerCase().includes(q)
      )
   }, [allProducts, searchQuery])

   // --- Handlers using real contexts ---
   const handleAddToCart = (product: ProductItem) => {
      cart.addItem({
         id: product.id,
         title: product.title,
         price: product.price,
         image: product.image,
         currency: product.currency || 'ETB',
         subtitle: product.subtitle,
         type: product.type
      })
   }

   const handleBuyNow = (product: ProductItem) => {
      // Add to cart if not already present
      if (!cart.isInCart(product.id)) {
         cart.addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            currency: product.currency || 'ETB',
            subtitle: product.subtitle,
            type: product.type
         })
      }
      router.push('/cart')
   }

   const handleToggleFavourite = (product: ProductItem) => {
      favourites.toggleFavourite(product.id)
   }

   const isFaved = (id: string) => favourites.isFavourite(id)

   const fade = { duration: 0.15, ease: 'linear' as const }

   return (
      <>
         {/* --- modals --- */}
         <InfoModal
            open={!!infoProduct}
            onOpenChange={(open: boolean) => !open && setInfoProduct(null)}
            product={
               infoProduct
                  ? {
                       ...infoProduct,
                       currency: infoProduct.currency || 'ETB',
                       originalPrice: undefined, // not needed for info
                       rating: undefined
                    }
                  : {
                       id: '',
                       title: '',
                       price: 0,
                       currency: 'ETB',
                       image: null
                    }
            }
         />
         <ReportModal
            open={!!reportProduct}
            onOpenChange={(open: boolean) => !open && setReportProduct(null)}
            productId={reportProduct?.id || ''}
            productTitle={reportProduct?.title || ''}
         />

         <main className="mt-28 pb-16">
            <Intro
               heading="Our Products"
               paragraph="Browse gaming packages, social media services, and more.">
               <DiscoverButton
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
               />
            </Intro>

            <div className="px-4 md:px-6 max-w-7xl mx-auto">
               {/* Toolbar */}
               <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-3">
                     <AnimatedCollection
                        view={view}
                        onViewChange={setView}
                     />
                     <span className="text-xs text-muted-foreground font-medium">
                        {filteredProducts.length} item
                        {filteredProducts.length !== 1 ? 's' : ''}
                     </span>
                  </div>
                  {currentCategory && (
                     <h2 className="text-sm font-medium text-muted-foreground">
                        {currentCategory.name}
                     </h2>
                  )}
               </div>

               {/* Empty state */}
               {filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                     <Search className="w-12 h-12 mb-4 opacity-20" />
                     <p className="text-sm font-medium">No products found</p>
                     <p className="text-xs">
                        Try a different search or category
                     </p>
                  </div>
               ) : (
                  <LayoutGroup>
                     {/* GRID */}
                     {view === 'grid' && (
                        <motion.div
                           layout
                           transition={spring}
                           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                           {filteredProducts.map(product => (
                              <motion.div
                                 key={product.id}
                                 layout
                                 transition={spring}>
                                 <AnimatePresence
                                    mode="popLayout"
                                    initial={false}>
                                    <motion.div
                                       key={`${product.id}-grid`}
                                       initial={{ opacity: 0, scale: 0.96 }}
                                       animate={{ opacity: 1, scale: 1 }}
                                       exit={{ opacity: 0, scale: 0.96 }}
                                       transition={fade}>
                                       <ProductCard
                                          {...product}
                                          onAddToCart={() => {}}
                                       />
                                    </motion.div>
                                 </AnimatePresence>
                              </motion.div>
                           ))}
                        </motion.div>
                     )}

                     {/* LIST */}
                     {view === 'list' && (
                        <motion.div
                           layout
                           transition={spring}
                           className="flex flex-col gap-3">
                           {filteredProducts.map(product => (
                              <motion.div
                                 key={product.id}
                                 layout
                                 transition={spring}>
                                 <AnimatePresence
                                    mode="popLayout"
                                    initial={false}>
                                    <motion.div
                                       key={`${product.id}-list`}
                                       initial={{ opacity: 0, x: -8 }}
                                       animate={{ opacity: 1, x: 0 }}
                                       exit={{ opacity: 0, x: -8 }}
                                       transition={fade}>
                                       <HorizontalProductCard
                                          product={product}
                                          faved={isFaved(product.id)}
                                          onAddToCart={() =>
                                             handleAddToCart(product)
                                          }
                                          onBuyNow={() => handleBuyNow(product)}
                                          onFavourite={() =>
                                             handleToggleFavourite(product)
                                          }
                                          onReport={() =>
                                             setReportProduct(product)
                                          }
                                          onInfo={() => setInfoProduct(product)}
                                       />
                                    </motion.div>
                                 </AnimatePresence>
                              </motion.div>
                           ))}
                        </motion.div>
                     )}

                     {/* PACK */}
                     {view === 'pack' && (
                        <motion.div
                           layout
                           transition={spring}
                           className="flex flex-wrap items-start justify-center gap-8 py-8">
                           {filteredProducts.map((product, index) => (
                              <AnimatePresence
                                 key={product.id}
                                 mode="popLayout"
                                 initial={false}>
                                 <motion.div
                                    key={`${product.id}-pack`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.88 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.88 }}
                                    transition={fade}>
                                    <PackCard
                                       product={product}
                                       index={index}
                                       faved={isFaved(product.id)}
                                       carted={cart.isInCart(product.id)}
                                       onAddToCart={() =>
                                          handleAddToCart(product)
                                       }
                                       onBuyNow={() => handleBuyNow(product)}
                                       onFavourite={() =>
                                          handleToggleFavourite(product)
                                       }
                                       onReport={() =>
                                          setReportProduct(product)
                                       }
                                       onInfo={() => setInfoProduct(product)}
                                    />
                                 </motion.div>
                              </AnimatePresence>
                           ))}
                        </motion.div>
                     )}
                  </LayoutGroup>
               )}
            </div>
         </main>
      </>
   )
}
