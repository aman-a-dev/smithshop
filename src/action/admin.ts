// app/admin/actions/admin.ts
'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'          // adjust to your prisma client singleton path
import { auth } from '@/lib/auth'              // adjust to your better-auth server instance path
import type { Prisma, OrderStatus, PaymentStatus } from '@/generated/prisma/browser'

// ------------------------------------------------------------------
// Types — derived, not hardcoded
// ------------------------------------------------------------------

// User shape comes from better-auth's own return type (it manages the
// `user` table, including admin-plugin fields like role/banned).
type AdminListUsersResult = Awaited<ReturnType<typeof auth.api.listUsers>>
export type AdminUser = AdminListUsersResult['users'][number]

// Everything else is a real Prisma model — use generated payload types
// so shapes stay in sync with schema.prisma automatically.
export type ProductWithRelations = Prisma.PackageGetPayload<{
  include: { product: { include: { category: true } } }
}>

export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: { select: { id: true; name: true; email: true } }
    items: { include: { package: true } }
    payment: true
  }
}>

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    user: { select: { id: true; name: true; email: true } }
    payment: true
  }
}>

export interface DashboardStat {
  title: string
  value: number
  change: string
  url: string
}

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

function fail(error: unknown): ActionResult<never> {
  return { success: false, error: error instanceof Error ? error.message : 'Unexpected error' }
}

// ------------------------------------------------------------------
// Zod schemas
// ------------------------------------------------------------------

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.union([
    z.enum(['admin', 'user']),
    z.array(z.enum(['admin', 'user']))
  ]).optional(),
})
const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
})

const banUserSchema = z.object({
  userId: z.string(),
  banReason: z.string().optional(),
  banExpiresIn: z.number().int().positive().optional(), // seconds
})

const createPackageSchema = z.object({
  productId: z.string(),
  label: z.string().min(1),
  price: z.number().int().nonnegative(),
  costPrice: z.number().int().nonnegative().optional(),
  amount: z.number().int().optional(),
  level: z.number().int().optional(),
  diamonds: z.number().int().optional(),
  membershipName: z.string().optional(),
  duration: z.string().optional(),
  isActive: z.boolean().optional(),
  sku: z.string().optional(), // <-- add optional here
})

const updatePackageSchema = createPackageSchema.partial().extend({
  id: z.string(),
})

const updateOrderStatusSchema = z.object({
  id: z.string(),
  status: z.enum([
    'PENDING',
    'AWAITING_PAYMENT',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
    'REFUNDED',
  ]),
})

// ------------------------------------------------------------------
// Users — via better-auth admin plugin (do not touch the table directly)
// ------------------------------------------------------------------

export async function getUsers(params?: {
  limit?: number
  offset?: number
  searchValue?: string
}): Promise<ActionResult<{ users: AdminUser[]; total: number }>> {
  try {
    const result = await auth.api.listUsers({
      query: {
        limit: params?.limit ?? 100,
        offset: params?.offset ?? 0,
        searchValue: params?.searchValue,
        searchField: 'email',
        searchOperator: 'contains',
      },
      headers: await headers(),
    })
    return { success: true, data: { users: result.users as AdminUser[], total: result.total } }
  } catch (e) {
    return fail(e)
  }
}

export async function getUser(id: string): Promise<ActionResult<AdminUser>> {
  try {
    const data = await auth.api.getUser({ query: { id }, headers: await headers() })
    if (!data) throw new Error('User not found')
    return { success: true, data: data as AdminUser }
  } catch (e) {
    return fail(e)
  }
}

export async function createUser(input: unknown): Promise<ActionResult<AdminUser>> {
  const parsed = createUserSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  try {
    const newUser = await auth.api.createUser({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
        name: parsed.data.name,
        role: parsed.data.role ?? 'user',
      },
      headers: await headers(),
    })
    revalidatePath('/admin/users')
    return { success: true, data: newUser as unknown as AdminUser }
  } catch (e) {
    return fail(e)
  }
}

export async function updateUser(userId: string, input: unknown): Promise<ActionResult<AdminUser>> {
  const parsed = updateUserSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  try {
    const updated = await auth.api.adminUpdateUser({
      body: { userId, data: parsed.data },
      headers: await headers(),
    })
    revalidatePath('/admin/users')
    return { success: true, data: updated as unknown as AdminUser }
  } catch (e) {
    return fail(e)
  }
}

export async function banUser(input: unknown): Promise<ActionResult<null>> {
  const parsed = banUserSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  try {
    await auth.api.banUser({ body: parsed.data, headers: await headers() })
    revalidatePath('/admin/users')
    return { success: true, data: null }
  } catch (e) {
    return fail(e)
  }
}

export async function unbanUser(userId: string): Promise<ActionResult<null>> {
  try {
    await auth.api.unbanUser({ body: { userId }, headers: await headers() })
    revalidatePath('/admin/users')
    return { success: true, data: null }
  } catch (e) {
    return fail(e)
  }
}

export async function deleteUser(userId: string): Promise<ActionResult<null>> {
  try {
    await auth.api.removeUser({ body: { userId }, headers: await headers() })
    revalidatePath('/admin/users')
    return { success: true, data: null }
  } catch (e) {
    return fail(e)
  }
}

// ------------------------------------------------------------------
// Products (Package model) — via Prisma
// ------------------------------------------------------------------

const productInclude = { product: { include: { category: true } } } as const

// Used to populate the "Product" select when creating/editing a Package
// in the admin UI (a Package always belongs to an existing Product).
export type ProductOption = Prisma.ProductGetPayload<{ include: { category: true } }>

export async function getProductOptions(): Promise<ActionResult<ProductOption[]>> {
  try {
    const data = await prisma.product.findMany({
      include: { category: true },
      orderBy: { name: 'asc' },
    })
    return { success: true, data }
  } catch (e) {
    return fail(e)
  }
}

export async function getProducts(): Promise<ActionResult<ProductWithRelations[]>> {
  try {
    const data = await prisma.package.findMany({
      include: productInclude,
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data }
  } catch (e) {
    return fail(e)
  }
}

export async function createProduct(input: unknown): Promise<ActionResult<ProductWithRelations>> {
  const parsed = createPackageSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  try {

    const payload = { ...parsed.data, sku: parsed.data.sku ?? `pkg-${Date.now()}` }
    const data = await prisma.package.create({ data: payload, include: productInclude })
    revalidatePath('/admin/products')
    return { success: true, data }
  } catch (e) {
    return fail(e)
  }
}

export async function updateProduct(input: unknown): Promise<ActionResult<ProductWithRelations>> {
  const parsed = updatePackageSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  const { id, ...rest } = parsed.data
  try {
    const data = await prisma.package.update({
      where: { id },
      data: rest,
      include: productInclude,
    })
    revalidatePath('/admin/products')
    return { success: true, data }
  } catch (e) {
    return fail(e)
  }
}

export async function deleteProduct(id: string): Promise<ActionResult<null>> {
  try {
    // Package has onDelete: Restrict from OrderItem — this will throw
    // if the package is referenced by an existing order. Consider
    // setting isActive: false instead of a hard delete in that case.
    await prisma.package.delete({ where: { id } })
    revalidatePath('/admin/products')
    return { success: true, data: null }
  } catch (e) {
    return fail(e)
  }
}

// ------------------------------------------------------------------
// Orders — via Prisma
// ------------------------------------------------------------------

const orderInclude = {
  user: { select: { id: true, name: true, email: true } },
  items: { include: { package: true } },
  payment: true,
} as const

export async function getOrders(): Promise<ActionResult<OrderWithRelations[]>> {
  try {
    const data = await prisma.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data }
  } catch (e) {
    return fail(e)
  }
}

export async function getOrder(id: string): Promise<ActionResult<OrderWithRelations>> {
  try {
    const data = await prisma.order.findUniqueOrThrow({ where: { id }, include: orderInclude })
    return { success: true, data }
  } catch (e) {
    return fail(e)
  }
}

export async function updateOrderStatus(input: unknown): Promise<ActionResult<OrderWithRelations>> {
  const parsed = updateOrderStatusSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }

  try {
    const data = await prisma.order.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status as OrderStatus },
      include: orderInclude,
    })
    revalidatePath('/admin/orders')
    return { success: true, data }
  } catch (e) {
    return fail(e)
  }
}

// ------------------------------------------------------------------
// Transactions & Balance — via Prisma
// ------------------------------------------------------------------

export async function getTransactions(): Promise<ActionResult<TransactionWithRelations[]>> {
  try {
    const data = await prisma.transaction.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return { success: true, data }
  } catch (e) {
    return fail(e)
  }
}

export async function getBalance(): Promise<ActionResult<{ balance: number; transactions: TransactionWithRelations[] }>> {
  try {
    const [{ _sum }, transactions] = await Promise.all([
      prisma.transaction.aggregate({ _sum: { amount: true } }),
      prisma.transaction.findMany({
        include: { user: { select: { id: true, name: true, email: true } }, payment: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ])
    return { success: true, data: { balance: _sum.amount ?? 0, transactions } }
  } catch (e) {
    return fail(e)
  }
}

// ------------------------------------------------------------------
// Dashboard Stats — via Prisma
// ------------------------------------------------------------------

export async function getDashboardStats(): Promise<ActionResult<DashboardStat[]>> {
  try {
    const [userCount, productCount, orderCount, { _sum }] = await Promise.all([
      prisma.user.count(),
      prisma.package.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.transaction.aggregate({ _sum: { amount: true } }),
    ])

    const stats: DashboardStat[] = [
      { title: 'Balance', value: _sum.amount ?? 0, change: '', url: '/admin/balance' },
      { title: 'Total Users', value: userCount, change: '', url: '/admin/users' },
      { title: 'Products', value: productCount, change: '', url: '/admin/products' },
      { title: 'Orders', value: orderCount, change: '', url: '/admin/orders' },
    ]
    return { success: true, data: stats }
  } catch (e) {
    return fail(e)
  }
}
