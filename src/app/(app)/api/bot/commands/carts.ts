import { BotContext } from '../index'
import prisma from '@/lib/prisma'
import { getCartKeyboard } from '@/app/(app)/api/bot/keyboard/keyboards'

export async function cartsCommand(ctx: BotContext) {
  if (!ctx.user) {
    await ctx.reply('❌ Please start the bot first with /start')
    return
  }

  const cartItems = await prisma.cart.findMany({
    where: { userId: ctx.user.id },
    include: {
      package: true,
    },
  })

  if (!cartItems.length) {
    await ctx.reply('🛒 Your cart is empty.\nBrowse products to add items!')
    return
  }

  const itemsForKeyboard = cartItems.map((item) => ({
    id: item.id,
    packageLabel: item.package.label,
    quantity: item.quantity,
    unitPrice: item.package.price,
  }))

  let msg = '<b>🛒 Your Cart</b>\n\n'
  let total = 0
  cartItems.forEach((item) => {
    const subtotal = item.quantity * item.package.price
    total += subtotal
    msg += `• ${item.package.label} x${item.quantity} – ${(subtotal / 100).toFixed(2)} ETB\n`
  })
  msg += `\n<b>Total: ${(total / 100).toFixed(2)} ETB</b>`

  await ctx.reply(msg, {
    reply_markup: getCartKeyboard(itemsForKeyboard),
    parse_mode: 'HTML',
  })
}