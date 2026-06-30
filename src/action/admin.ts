// app/admin/actions/admin.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// ---------- Types ----------
export interface User {
   id: number
   name: string
   email: string
   status: 'Active' | 'Inactive' | 'Suspended'
   joined: string
}

export interface Product {
   id: string
   name: string
   price: string
   stock: number
   status: 'Active' | 'Out of Stock'
}

export interface Order {
   id: string
   user: string
   amount: string
   status: 'Completed' | 'Pending' | 'Failed' | 'Processing'
   date: string
}

export interface Transaction {
   id: number
   type: 'Deposit' | 'Withdrawal' | 'Payout'
   amount: string
   date: string
   status: 'Completed' | 'Pending' | 'Failed'
}

export interface DashboardStat {
   title: string
   value: number
   change: string
   url: string
}

// ---------- Demo Data ----------
const demoUsers: User[] = [
   {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Active',
      joined: '2026-06-01'
   },
   {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Inactive',
      joined: '2026-05-15'
   },
   {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 'Active',
      joined: '2026-04-20'
   },
   {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      status: 'Suspended',
      joined: '2026-03-10'
   }
]

const demoProducts: Product[] = [
   {
      id: 'P001',
      name: 'Top-Up $10',
      price: '$10.00',
      stock: 250,
      status: 'Active'
   },
   {
      id: 'P002',
      name: 'Top-Up $20',
      price: '$20.00',
      stock: 180,
      status: 'Active'
   },
   {
      id: 'P003',
      name: 'Top-Up $50',
      price: '$50.00',
      stock: 95,
      status: 'Active'
   },
   {
      id: 'P004',
      name: 'Premium Pack',
      price: '$100.00',
      stock: 0,
      status: 'Out of Stock'
   }
]

const demoOrders: Order[] = [
   {
      id: '#1001',
      user: 'John Doe',
      amount: '$45.00',
      status: 'Completed',
      date: '2026-06-28'
   },
   {
      id: '#1002',
      user: 'Jane Smith',
      amount: '$32.50',
      status: 'Pending',
      date: '2026-06-27'
   },
   {
      id: '#1003',
      user: 'Bob Johnson',
      amount: '$67.80',
      status: 'Failed',
      date: '2026-06-27'
   },
   {
      id: '#1004',
      user: 'Alice Brown',
      amount: '$21.20',
      status: 'Completed',
      date: '2026-06-26'
   },
   {
      id: '#1005',
      user: 'Charlie Wilson',
      amount: '$54.90',
      status: 'Processing',
      date: '2026-06-25'
   }
]

const demoTransactions: Transaction[] = [
   {
      id: 1,
      type: 'Deposit',
      amount: '+$5,000',
      date: '2026-06-28',
      status: 'Completed'
   },
   {
      id: 2,
      type: 'Withdrawal',
      amount: '-$2,300',
      date: '2026-06-27',
      status: 'Pending'
   },
   {
      id: 3,
      type: 'Deposit',
      amount: '+$1,200',
      date: '2026-06-26',
      status: 'Completed'
   },
   {
      id: 4,
      type: 'Payout',
      amount: '-$450',
      date: '2026-06-25',
      status: 'Failed'
   }
]

// ---------- Zod Schemas ----------
const createUserSchema = z.object({
   name: z.string().min(1),
   email: z.string().email(),
   status: z.enum(['Active', 'Inactive', 'Suspended']).optional()
})

const updateUserSchema = createUserSchema.partial()

// ---------- Server Actions ----------

// --- Users ---
export async function getUsers(): Promise<{
   success: boolean
   data?: User[]
   error?: string
}> {
   try {
      // Simulate async DB call
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, data: demoUsers }
   } catch (error: unknown) {
      return { success: false, error: (error as Error).message }
   }
}

export async function getUser(
   id: number
): Promise<{ success: boolean; data?: User; error?: string }> {
   try {
      const user = demoUsers.find(u => u.id === id)
      if (!user) throw new Error('User not found')
      return { success: true, data: user }
   } catch (error: unknown) {
      return { success: false, error: (error as Error).message }
   }
}

export async function createUser(
   input: unknown
): Promise<{ success: boolean; data?: User; error?: string }> {
   const result = createUserSchema.safeParse(input)

   if (!result.success) {
      return {
         success: false,
         error: result.error.issues[0]?.message ?? 'Invalid input'
      }
   }

   const parsed = result.data

   const newUser: User = {
      id: Math.max(0, ...demoUsers.map(u => u.id)) + 1,
      name: parsed.name,
      email: parsed.email,
      status: parsed.status || 'Active',
      joined: new Date().toISOString().slice(0, 10)
   }

   demoUsers.push(newUser)
   revalidatePath('/admin/users')
   return { success: true, data: newUser }
}

export async function updateUser(
   id: number,
   input: unknown
): Promise<{ success: boolean; data?: User; error?: string }> {
   const result = updateUserSchema.safeParse(input)

   if (!result.success) {
      return {
         success: false,
         error: result.error.issues[0]?.message ?? 'Invalid input'
      }
   }

   const index = demoUsers.findIndex(u => u.id === id)
   if (index === -1) return { success: false, error: 'User not found' }

   const updated = { ...demoUsers[index], ...result.data }
   demoUsers[index] = updated

   revalidatePath('/admin/users')
   return { success: true, data: updated }
}

export async function deleteUser(
   id: number
): Promise<{ success: boolean; error?: string }> {
   try {
      const index = demoUsers.findIndex(u => u.id === id)
      if (index === -1) throw new Error('User not found')
      demoUsers.splice(index, 1)
      revalidatePath('/admin/users')
      return { success: true }
   } catch (error: unknown) {
      return { success: false, error: (error as Error).message }
   }
}

// --- Products ---
export async function getProducts(): Promise<{
   success: boolean
   data?: Product[]
   error?: string
}> {
   try {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, data: demoProducts }
   } catch (error: unknown) {
      return { success: false, error: (error as Error).message }
   }
}

export async function createProduct(
   input: unknown
): Promise<{ success: boolean; data?: Product; error?: string }> {
   // Similar implementation with Zod schema...
   // For brevity, placeholder.
   
   
   return { success: false, error: 'Not implemented' }
}

// --- Orders ---
export async function getOrders(): Promise<{
   success: boolean
   data?: Order[]
   error?: string
}> {
   try {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { success: true, data: demoOrders }
   } catch (error: unknown) {
      return { success: false, error: (error as Error).message }
   }
}

// --- Balance & Transactions ---
export async function getBalance(): Promise<{
   success: boolean
   data?: { balance: number; transactions: Transaction[] }
   error?: string
}> {
   try {
      await new Promise(resolve => setTimeout(resolve, 300))
      // For demo, balance is sum of completed deposits minus withdrawals/payouts
      const balance = 0 // you can compute from transactions
      return {
         success: true,
         data: { balance, transactions: demoTransactions }
      }
   } catch (error: unknown) {
      return { success: false, error: (error as Error).message }
   }
}

// --- Dashboard Stats ---
export async function getDashboardStats(): Promise<{
   success: boolean
   data?: DashboardStat[]
   error?: string
}> {
   try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const stats: DashboardStat[] = [
         { title: 'Balance', value: 24560, change: '+3%', url: '/balance' },
         {
            title: 'Total Users',
            value: demoUsers.length,
            change: '+12%',
            url: '/users'
         },
         {
            title: 'Products',
            value: demoProducts.length,
            change: '+5%',
            url: '/products'
         },
         {
            title: 'Orders',
            value: demoOrders.length,
            change: '+8%',
            url: '/orders'
         }
      ]
      return { success: true, data: stats }
   } catch (error: unknown) {
      return { success: false, error: (error as Error).message }
   }
}
