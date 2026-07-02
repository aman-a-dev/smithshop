import { BotContext } from '../index'
import prisma from '@/lib/prisma'

export async function categoriesCommand(ctx: BotContext) {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          products: { where: { isActive: true } },
        },
      },
    },
  })

  if (!categories.length) {
    await ctx.reply('📭 No categories available.')
    return
  }

  let msg = '<b>📂 All Categories</b>\n\n'
  categories.forEach((cat) => {
    msg += `• <b>${cat.name}</b> (${cat._count.products} products)\n`
  })
  msg += '\nUse /products to browse categories with products.'

  await ctx.reply(msg, { parse_mode: 'HTML' })
}