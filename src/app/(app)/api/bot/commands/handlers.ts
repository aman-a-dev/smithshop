import { BotContext } from '../index'
import prisma from '@/lib/prisma'
import { showProducts, showPackages } from './products'
import { getPackageActionKeyboard, getOrderConfirmationKeyboard } from '@/app/(app)/api/bot/keyboard/keyboards'

// ---------- Category / Product / Package Selection ----------
export async function handleCategorySelection(ctx: BotContext, categoryId: string) {
  await showProducts(ctx, categoryId)
}

export async function handleProductSelection(ctx: BotContext, productId: string) {
  await showPackages(ctx, productId)
}

export async function handlePackageSelection(ctx: BotContext, packageId: string) {
  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    include: { product: { include: { category: true } } },
  })

  if (!pkg) {
    await ctx.reply('❌ Package not found.')
    return
  }

  ctx.session.selectedPackageId = packageId
  ctx.session.step = 'selecting_package'

  const price = (pkg.price / 100).toFixed(2)
  const msg = `
<b>📦 ${pkg.product.name}</b>
<i>${pkg.label}</i>

📊 <b>Price:</b> ${price} ETB
📝 <b>Product Type:</b> ${pkg.product.type}
${pkg.amount ? `💎 <b>Amount:</b> ${pkg.amount}` : ''}
${pkg.level ? `⭐ <b>Level:</b> ${pkg.level}` : ''}
${pkg.duration ? `⏱️ <b>Duration:</b> ${pkg.duration}` : ''}
  `

  await ctx.reply(msg, {
    parse_mode: 'HTML',
    reply_markup: getPackageActionKeyboard(packageId),
  })
}

// ---------- Add to Cart ----------
export async function handleAddToCart(ctx: BotContext, packageId: string) {
  if (!ctx.user) {
    await ctx.reply('❌ Please start the bot first.')
    return
  }

  const existing = await prisma.cart.findFirst({
    where: {
      userId: ctx.user.id,
      packageId: packageId,
    },
  })

  if (existing) {
    await prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
    })
  } else {
    await prisma.cart.create({
      data: {
        userId: ctx.user.id,
        packageId: packageId,
        quantity: 1,
      },
    })
  }

  await ctx.reply('✅ Added to cart!')
  if (ctx.session.selectedCategoryId) {
    await showProducts(ctx, ctx.session.selectedCategoryId)
  } else {
    const { productsCommand } = await import('./products')
    await productsCommand(ctx)
  }
}

// ---------- Remove from Cart ----------
export async function handleRemoveFromCart(ctx: BotContext, cartItemId: string) {
  await prisma.cart.delete({ where: { id: cartItemId } })
  await ctx.reply('🗑️ Removed from cart.')
  const { cartsCommand } = await import('./carts')
  await cartsCommand(ctx)
}

export async function handleClearCart(ctx: BotContext) {
  if (!ctx.user) return
  await prisma.cart.deleteMany({ where: { userId: ctx.user.id } })
  await ctx.reply('🗑️ Cart cleared.')
  const { cartsCommand } = await import('./carts')
  await cartsCommand(ctx)
}

// ---------- Checkout from Cart ----------
export async function handleCheckout(ctx: BotContext, targetId?: string) {
  if (!ctx.user) {
    await ctx.reply('❌ Please start the bot first.')
    return
  }

  const session = ctx.session

  if (session.step === 'checkout' && targetId) {
    // Validate target ID
    if (!/^\d+$/.test(targetId) && !/^[A-Za-z0-9]+$/.test(targetId)) {
      await ctx.reply('❌ Invalid ID format. Please enter a valid alphanumeric ID.')
      return
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId: ctx.user.id },
      include: { package: true },
    })

    if (!cartItems.length) {
      await ctx.reply('🛒 Your cart is empty.')
      ctx.session.step = 'idle'
      return
    }

    let total = 0
    const orderItems = cartItems.map((item) => {
      const subtotal = item.quantity * item.package.price
      total += subtotal
      return {
        packageId: item.packageId,
        quantity: item.quantity,
        unitPrice: item.package.price,
        subtotal: subtotal,
      }
    })

    const order = await prisma.order.create({
      data: {
        userId: ctx.user.id,
        status: 'AWAITING_PAYMENT',
        totalAmount: total,
        targetId: targetId,
        items: {
          create: orderItems,
        },
      },
    })

    await prisma.payment.create({
      data: {
        orderId: order.id,
        userId: ctx.user.id,
        status: 'INITIATED',
        amount: total,
      },
    })

    // Clear cart
    await prisma.cart.deleteMany({ where: { userId: ctx.user.id } })

    ctx.session.step = 'idle'
    ctx.session.targetId = undefined

    const msg = `
<b>✅ Order Created!</b>

📋 <b>Order ID:</b> ${order.id.slice(0, 10)}
💰 <b>Amount:</b> ${(total / 100).toFixed(2)} ETB
🎯 <b>Target ID:</b> ${targetId}

<b>📌 Next Steps:</b>
1. Click the payment link below (coming soon)
2. Complete payment via Chapa
3. Wait for confirmation (5-30 mins)

You can check your order status anytime with /orders

⚠️ <i>Note: Your order will be cancelled if payment is not completed within 30 minutes.</i>
    `

    await ctx.reply(msg, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          // [{ text: '💳 Complete Payment', url: checkoutUrl }],
          [{ text: '📊 Check Status', callback_data: `order_status_${order.id}` }],
          [{ text: '🏠 Back to Menu', callback_data: 'back_to_menu' }],
        ],
      },
    })
    return
  }

  // Initial checkout – ask for target ID
  const cartItems = await prisma.cart.findMany({
    where: { userId: ctx.user.id },
    include: { package: true },
  })

  if (!cartItems.length) {
    await ctx.reply('🛒 Your cart is empty.')
    return
  }

  ctx.session.step = 'checkout'
  await ctx.reply(
    'Please enter your <b>Game ID / Account ID</b> for this order.\n\n' +
    'Example: 123456789',
    { parse_mode: 'HTML' }
  )
}

// ---------- Order Confirmation (Buy Now flow) ----------
export async function handleOrderConfirmation(ctx: BotContext) {
  const session = ctx.session
  const packageId = session.selectedPackageId
  const targetId = session.targetId

  if (!packageId || !targetId) {
    await ctx.reply('❌ Missing order information. Please start over.')
    return
  }

  try {
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: { product: true },
    })

    if (!pkg) {
      await ctx.reply('❌ Package not found.')
      return
    }

    const order = await prisma.order.create({
      data: {
        userId: ctx.user.id,
        status: 'AWAITING_PAYMENT',
        totalAmount: pkg.price,
        targetId: targetId,
        items: {
          create: {
            packageId: packageId,
            quantity: 1,
            unitPrice: pkg.price,
            subtotal: pkg.price,
          },
        },
      },
    })

    await prisma.payment.create({
      data: {
        orderId: order.id,
        userId: ctx.user.id,
        status: 'INITIATED',
        amount: pkg.price,
      },
    })

    ctx.session.step = 'idle'
    ctx.session.selectedPackageId = undefined
    ctx.session.targetId = undefined

    const msg = `
<b>✅ Order Created!</b>

📋 <b>Order ID:</b> ${order.id.slice(0, 10)}
💰 <b>Amount:</b> ${(pkg.price / 100).toFixed(2)} ETB
🎯 <b>Target ID:</b> ${targetId}

<b>📌 Next Steps:</b>
1. Click the payment link below
2. Complete payment via Chapa
3. Wait for confirmation (5-30 mins)

You can check your order status anytime with /orders
    `

    await ctx.reply(msg, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          // [{ text: '💳 Complete Payment', url: checkoutUrl }],
          [{ text: '📊 Check Status', callback_data: `order_status_${order.id}` }],
          [{ text: '🏠 Back to Menu', callback_data: 'back_to_menu' }],
        ],
      },
    })
  } catch (error) {
    console.error('Order creation error:', error)
    await ctx.reply('❌ Failed to create order. Please try again.')
  }
}

// ---------- Target ID Input (Buy Now) ----------
export async function handleTargetIdInput(ctx: BotContext) {
  const targetId = ctx.message?.text?.trim()

  if (!targetId) {
    await ctx.reply('❌ Please enter a valid ID.')
    return
  }

  if (!/^\d+$/.test(targetId) && !/^[A-Za-z0-9]+$/.test(targetId)) {
    await ctx.reply('❌ Invalid ID format. Please enter a valid alphanumeric ID.')
    return
  }

  const packageId = ctx.session.selectedPackageId
  if (!packageId) {
    await ctx.reply('❌ Session expired. Please start over.')
    return
  }

  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    include: { product: true },
  })

  if (!pkg) {
    await ctx.reply('❌ Package not found. Please try again.')
    return
  }

  ctx.session.targetId = targetId

  const price = (pkg.price / 100).toFixed(2)
  const msg = `
<b>🛒 Order Confirmation</b>

📦 <b>Product:</b> ${pkg.product.name}
📝 <b>Package:</b> ${pkg.label}
💰 <b>Price:</b> ${price} ETB
🎯 <b>Target ID:</b> ${targetId}

Please confirm your order:
  `

  await ctx.reply(msg, {
    parse_mode: 'HTML',
    reply_markup: getOrderConfirmationKeyboard(),
  })
}

// ---------- Navigation Helpers ----------
export async function handleBackToCategories(ctx: BotContext) {
  const { productsCommand } = await import('./products')
  await productsCommand(ctx)
}

export async function handleBackToProducts(ctx: BotContext) {
  if (ctx.session.selectedCategoryId) {
    await showProducts(ctx, ctx.session.selectedCategoryId)
  } else {
    const { productsCommand } = await import('./products')
    await productsCommand(ctx)
  }
}

export async function handleBackToMenu(ctx: BotContext) {
  const { startCommand } = await import('./start')
  await startCommand(ctx)
}

// ---------- Order Status Helper ----------
export async function showOrderStatus(ctx: BotContext, orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      payment: true,
      items: {
        include: {
          package: { include: { product: true } },
        },
      },
    },
  })

  if (!order) {
    await ctx.reply('❌ Order not found.')
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

  const msg = `
<b>📊 Order Status</b>

${statusEmoji[order.status] || '📌'} <b>Order #${order.id.slice(0, 8)}</b>
📅 Date: ${order.createdAt.toLocaleString()}
💰 Amount: ${(order.totalAmount / 100).toFixed(2)} ETB
📊 Status: ${order.status}
🎯 Target ID: ${order.targetId || 'N/A'}
📝 Items: ${order.items.map((item) => `${item.quantity}x ${item.package.product.name}`).join(', ')}
${order.payment?.status ? `💳 Payment: ${order.payment.status}` : ''}
${order.fulfilmentRef ? `📋 Ref: ${order.fulfilmentRef}` : ''}
  `

  await ctx.reply(msg, { parse_mode: 'HTML' })
}