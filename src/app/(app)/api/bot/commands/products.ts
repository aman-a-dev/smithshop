import { BotContext } from '../index'
import prisma from '@/lib/prisma'
import { getCategoryKeyboard, getProductKeyboard, getPackageKeyboard } from '@/app/(app)/api/bot/keyboard/keyboards'

export async function productsCommand(ctx: BotContext) {
  const categories = await prisma.category.findMany({
    where: {
      products: {
        some: {
          isActive: true,
          packages: { some: { isActive: true } },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  if (!categories.length) {
    await ctx.reply('📭 No products available. Check back later.')
    return
  }

  await ctx.reply('<b>🛍️ Available Categories</b>\nSelect a category:', {
    reply_markup: getCategoryKeyboard(categories),
    parse_mode: 'HTML',
  })
}

export async function showProducts(ctx: BotContext, categoryId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      products: {
        where: {
          isActive: true,
          packages: { some: { isActive: true } },
        },
        include: { packages: { where: { isActive: true } } },
      },
    },
  })

  if (!category) {
    await ctx.reply('❌ Category not found.')
    return
  }

  if (!category.products.length) {
    await ctx.reply(`📭 No products in "${category.name}".`)
    return
  }

  ctx.session.selectedCategoryId = categoryId
  ctx.session.step = 'selecting_product'

  const productList = category.products.map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
  }))

  await ctx.reply(`<b>📦 ${category.name}</b>\nSelect a product:`, {
    reply_markup: getProductKeyboard(productList),
    parse_mode: 'HTML',
  })
}

export async function showPackages(ctx: BotContext, productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      packages: {
        where: { isActive: true },
        orderBy: { price: 'asc' },
      },
    },
  })

  if (!product) {
    await ctx.reply('❌ Product not found.')
    return
  }

  if (!product.packages.length) {
    await ctx.reply(`📭 No packages for "${product.name}".`)
    return
  }

  ctx.session.selectedProductId = productId
  ctx.session.step = 'selecting_package'

  const pkgList = product.packages.map((p) => ({
    id: p.id,
    label: p.label,
    price: p.price,
  }))

  await ctx.reply(
    `<b>📦 ${product.name}</b>\n<i>Category: ${product.category.name}</i>\n<i>Type: ${product.type}</i>\n\nSelect a package:`,
    {
      reply_markup: getPackageKeyboard(pkgList),
      parse_mode: 'HTML',
    }
  )
}