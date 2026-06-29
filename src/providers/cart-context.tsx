'use client'

import {
   createContext,
   useContext,
   useState,
   useEffect,
   ReactNode
} from 'react'
import { toast } from 'sonner'

export interface CartItem {
   id: string
   title: string
   price: number
   image: string
   currency: string
   quantity: number
   subtitle?: string
   type?: string
}

interface CartContextType {
   items: CartItem[]
   addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
   removeItem: (id: string) => void
   updateQuantity: (id: string, quantity: number) => void
   clearCart: () => void
   totalItems: number
   totalPrice: number
   isInCart: (id: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
   const [items, setItems] = useState<CartItem[]>(() => {
      try {
         const saved = localStorage.getItem('cart')
         if (saved) {
            return JSON.parse(saved)
         }
      } catch (e) {
         console.log(e)
      }
      return []
   })

   useEffect(() => {
      localStorage.setItem('cart', JSON.stringify(items))
   }, [items])

   const addItem = (
      newItem: Omit<CartItem, 'quantity'> & { quantity?: number }
   ) => {
      setItems(prev => {
         const existing = prev.find(item => item.id === newItem.id)
         if (existing) {
            toast.success(`Increased ${newItem.title} quantity`)
            return prev.map(item =>
               item.id === newItem.id
                  ? {
                       ...item,
                       quantity: item.quantity + (newItem.quantity || 1)
                    }
                  : item
            )
         }
         toast.success(`Added ${newItem.title} to cart`)
         return [...prev, { ...newItem, quantity: newItem.quantity || 1 }]
      })
   }

   const removeItem = (id: string) => {
      setItems(prev => prev.filter(item => item.id !== id))
      toast.info('Item removed from cart')
   }

   const updateQuantity = (id: string, quantity: number) => {
      if (quantity <= 0) {
         removeItem(id)
         return
      }
      setItems(prev =>
         prev.map(item => (item.id === id ? { ...item, quantity } : item))
      )
   }

   const clearCart = () => {
      setItems([])
      toast.info('Cart cleared')
   }

   const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
   const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
   )

   const isInCart = (id: string) => items.some(item => item.id === id)

   return (
      <CartContext.Provider
         value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            isInCart
         }}>
         {children}
      </CartContext.Provider>
   )
}

export function useCart() {
   const context = useContext(CartContext)
   if (!context) throw new Error('useCart must be used within a CartProvider')
   return context
}
