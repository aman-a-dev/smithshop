'use client'

import { useCart } from '@/providers/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Intro } from '@/components/shared/intro'

export default function CartPage() {
   const {
      items,
      removeItem,
      updateQuantity,
      totalPrice,
      totalItems,
      clearCart
   } = useCart()

   if (items.length === 0) {
      return (
         <main className='container mx-auto mt-40 px-4 py-16 text-center'>
            <Intro
               heading='Your cart is empty'
               paragraph="Looks like you haven't added anything yet."
               badge='Cart'
               icon={
                  <ShoppingBag className='mx-auto h-16 w-16 text-muted-foreground' />
               }
            >
               <Link href='/products'>
                  <Button className='mt-6'>Continue Shopping</Button>
               </Link>
            </Intro>
         </main>
      )
   }

   return (
      <main className='container mx-auto px-5 py-8 max-w-6xl'>
         <Intro
            heading={`Your Cart (${totalItems})`}
            paragraph='Prepared products in your cart 🛒'
            badge='Cart'
            icon={
               <ShoppingBag className='mx-auto h-16 w-16 text-muted-foreground' />
            }
         />

         <div className='grid lg:grid-cols-3 gap-8'>
            {/* Cart items */}
            <div className='lg:col-span-2 space-y-4'>
               <AnimatePresence mode='popLayout'>
                  {items.map(item => (
                     <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                     >
                        <Card>
                           <CardContent className='p-4 flex gap-4'>
                              <div className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md'>
                                 <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className='object-cover'
                                 />
                              </div>
                              <div className='flex flex-1 flex-col justify-between'>
                                 <div>
                                    <h3 className='font-semibold'>
                                       {item.title}
                                    </h3>
                                    <p className='text-sm text-muted-foreground'>
                                       {item.subtitle || item.type}
                                    </p>
                                 </div>
                                 <div className='flex items-center justify-between mt-2'>
                                    <div className='flex items-center gap-2'>
                                       <Button
                                          variant='outline'
                                          size='icon'
                                          className='h-8 w-8'
                                          onClick={() =>
                                             updateQuantity(
                                                item.id,
                                                item.quantity - 1
                                             )
                                          }
                                       >
                                          <Minus className='h-3 w-3' />
                                       </Button>
                                       <Input
                                          type='number'
                                          value={item.quantity}
                                          onChange={e =>
                                             updateQuantity(
                                                item.id,
                                                parseInt(e.target.value) || 1
                                             )
                                          }
                                          className='w-16 h-8 text-center'
                                          min={1}
                                       />
                                       <Button
                                          variant='outline'
                                          size='icon'
                                          className='h-8 w-8'
                                          onClick={() =>
                                             updateQuantity(
                                                item.id,
                                                item.quantity + 1
                                             )
                                          }
                                       >
                                          <Plus className='h-3 w-3' />
                                       </Button>
                                    </div>
                                    <div className='text-right'>
                                       <p className='font-bold'>
                                          {item.currency}{' '}
                                          {item.price * item.quantity}
                                       </p>
                                       <Button
                                          variant='ghost'
                                          size='sm'
                                          className='text-red-500 h-8 px-2'
                                          onClick={() => removeItem(item.id)}
                                       >
                                          <Trash2 className='h-4 w-4 mr-1' />
                                          Remove
                                       </Button>
                                    </div>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>

            {/* Order summary */}
            <div className='lg:col-span-1'>
               <Card>
                  <CardContent className='p-6'>
                     <h2 className='text-xl font-semibold'>Order Summary</h2>
                     <div className='mt-4 space-y-2'>
                        <div className='flex justify-between'>
                           <span>Subtotal ({totalItems} items)</span>
                           <span>ETB {totalPrice}</span>
                        </div>
                        <div className='flex justify-between'>
                           <span>Shipping</span>
                           <span>Calculated at checkout</span>
                        </div>
                        <div className='border-t pt-2 mt-2'>
                           <div className='flex justify-between font-bold text-lg'>
                              <span>Total</span>
                              <span>ETB {totalPrice}</span>
                           </div>
                        </div>
                     </div>
                     <div className='mt-6 space-y-3'>
                        <Button
                           className='w-full'
                           size='lg'
                        >
                           Proceed to Checkout
                        </Button>
                        <Button
                           variant='outline'
                           className='w-full'
                           onClick={clearCart}
                        >
                           Clear Cart
                        </Button>
                        <Link
                           href='/products'
                           passHref
                        >
                           <Button
                              variant='ghost'
                              className='w-full'
                           >
                              Continue Shopping
                           </Button>
                        </Link>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </main>
   )
}
