import { BotContext } from '../index'
import prisma from '@/lib/prisma'

export async function ordersCommand(ctx: BotContext) {
  if (!ctx.user) {
    await ctx.reply('❌ Please start the bot first with /start')
    return
  }

  const orders = await prisma.order.findMany({
    where: { userId: ctx.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      items: {
        include: {
          package: { include: { product: true } },
        },
      },
      payment: true,
    },
  })

  if (!orders.length) {
    await ctx.reply(
      '<b>📦 No Orders Found</b>\n\nYou haven\'t placed any orders yet.\nStart shopping with 🛍️ Products!',
      { parse_mode: 'HTML' }
    )
    return
  }

  const statusEmoji: Record<string, string> = {
    PENDING: '⏳',
    AWAITING_PAYMENT: '💳',
    PROCESSING: '🔄',
    COMPLETED: '✅',
    FAILED: '❌',
    CANCELLED: '🚫',
    REFUNDED: '↩️',
  }

  let msg = `<b>📦 Your Recent Orders (${orders.length})</b>\n\n`
  orders.forEach((order, i) => {
    const emoji = statusEmoji[order.status] || '📌'
    const total = (order.totalAmount / 100).toFixed(2)
    const items = order.items
      .map((item) => `${item.quantity}x ${item.package.product.name} (${item.package.label})`)
      .join(', ')
    msg += `
${i + 1}. ${emoji} <b>Order #${order.id.slice(0, 8)}</b>
   📅 ${order.createdAt.toLocaleDateString()}
   💰 ${total} ETB
   📊 Status: ${order.status}
   📝 Items: ${items}
   ${order.targetId ? `🎯 Target: ${order.targetId}` : ''}
   ${order.fulfilmentRef ? `📋 Ref: ${order.fulfilmentRef}` : ''}
`
    if (i < orders.length - 1) msg += '\n'
  })

  await ctx.reply(msg, { parse_mode: 'HTML' })
}