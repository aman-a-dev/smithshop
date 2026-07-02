import { Bot, session, type SessionFlavor, type Context } from 'grammy'
import { authMiddleware } from './middleware/auth'
import { startCommand } from './commands/start'
import { productsCommand } from './commands/products'
import { ordersCommand } from './commands/orders'
import { helpCommand } from './commands/help'
import { categoriesCommand } from './commands/categories'
import { cartsCommand } from './commands/carts'
import {
  handleCategorySelection,
  handleProductSelection,
  handlePackageSelection,
  handleTargetIdInput,
  handleOrderConfirmation,
  handleAddToCart,
  handleRemoveFromCart,
  handleClearCart,
  handleCheckout,
  handleBackToCategories,
  handleBackToProducts,
  handleBackToMenu,
  showOrderStatus,
} from './commands/handlers'
import { getMainKeyboard } from '@/app/(app)/api/bot/keyboard/keyboards'

// ---------- Session Data ----------
export interface SessionData {
  step: 'idle' | 'selecting_category' | 'selecting_product' | 'selecting_package' | 'entering_target_id' | 'checkout'
  selectedCategoryId?: string
  selectedProductId?: string
  selectedPackageId?: string
  targetId?: string
}

export type BotContext = Context & SessionFlavor<SessionData> & {
  user: {
    id: string
    telegramId: string
    name: string
    role: string
    banned: boolean
    banReason?: string
  }
}

// ---------- Bot Instance ----------
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
if (!BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is missing')

export const bot = new Bot<BotContext>(BOT_TOKEN)

// ---------- Middleware ----------
bot.use(
  session({
    initial: (): SessionData => ({ step: 'idle' }),
  })
)
bot.use(authMiddleware)

// ---------- Commands ----------
bot.command('start', startCommand)
bot.command('products', productsCommand)
bot.command('orders', ordersCommand)
bot.command('help', helpCommand)
bot.command('categories', categoriesCommand)
bot.command('carts', cartsCommand)

// ---------- Text Messages (for target ID input) ----------
bot.on('message:text', async (ctx) => {
  const session = ctx.session
  if (session.step === 'entering_target_id') {
    await handleTargetIdInput(ctx)
    return
  }
  if (session.step === 'checkout') {
    await handleCheckout(ctx, ctx.message.text)
    return
  }
})

// ---------- Callback Queries ----------
bot.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data

  // Category selection
  if (data.startsWith('cat_')) {
    await handleCategorySelection(ctx, data.replace('cat_', ''))
    await ctx.answerCallbackQuery()
    return
  }

  // Product selection
  if (data.startsWith('prod_')) {
    await handleProductSelection(ctx, data.replace('prod_', ''))
    await ctx.answerCallbackQuery()
    return
  }

  // Package selection
  if (data.startsWith('pkg_')) {
    await handlePackageSelection(ctx, data.replace('pkg_', ''))
    await ctx.answerCallbackQuery()
    return
  }

  // Add to cart
  if (data.startsWith('addcart_')) {
    await handleAddToCart(ctx, data.replace('addcart_', ''))
    await ctx.answerCallbackQuery()
    return
  }

  // Buy now
  if (data.startsWith('buynow_')) {
    // The package is already stored in session from handlePackageSelection
    ctx.session.step = 'entering_target_id'
    await ctx.reply('Please enter your Game ID / Account ID:')
    await ctx.answerCallbackQuery()
    return
  }

  // Remove from cart
  if (data.startsWith('removecart_')) {
    await handleRemoveFromCart(ctx, data.replace('removecart_', ''))
    await ctx.answerCallbackQuery()
    return
  }

  // Clear cart
  if (data === 'clear_cart') {
    await handleClearCart(ctx)
    await ctx.answerCallbackQuery()
    return
  }

  // Checkout from cart
  if (data === 'checkout_cart') {
    await handleCheckout(ctx)
    await ctx.answerCallbackQuery()
    return
  }

  // Order confirmation
  if (data === 'confirm_order') {
    await handleOrderConfirmation(ctx)
    await ctx.answerCallbackQuery()
    return
  }

  // Cancel order
  if (data === 'cancel_order') {
    ctx.session.step = 'idle'
    ctx.session.selectedCategoryId = undefined
    ctx.session.selectedProductId = undefined
    ctx.session.selectedPackageId = undefined
    ctx.session.targetId = undefined
    await ctx.reply('❌ Order cancelled. You can start again with /start')
    await ctx.answerCallbackQuery()
    return
  }

  // Navigation
  if (data === 'back_to_categories') {
    await handleBackToCategories(ctx)
    await ctx.answerCallbackQuery()
    return
  }
  if (data === 'back_to_products') {
    await handleBackToProducts(ctx)
    await ctx.answerCallbackQuery()
    return
  }
  if (data === 'back_to_menu') {
    await handleBackToMenu(ctx)
    await ctx.answerCallbackQuery()
    return
  }

  // Main menu buttons
  if (data === 'products') {
    await productsCommand(ctx)
    await ctx.answerCallbackQuery()
    return
  }
  if (data === 'orders') {
    await ordersCommand(ctx)
    await ctx.answerCallbackQuery()
    return
  }
  if (data === 'categories') {
    await categoriesCommand(ctx)
    await ctx.answerCallbackQuery()
    return
  }
  if (data === 'cart') {
    await cartsCommand(ctx)
    await ctx.answerCallbackQuery()
    return
  }
  if (data === 'help') {
    await helpCommand(ctx)
    await ctx.answerCallbackQuery()
    return
  }

  // Contact support
  if (data === 'contact_support') {
    await ctx.reply(
      '📞 <b>Contact Support</b>\n\n' +
      'Our support team is available 24/7:\n' +
      '• Telegram: @Smithdshop1\n' +
      '• Response time: < 15 minutes',
      { parse_mode: 'HTML' }
    )
    await ctx.answerCallbackQuery()
    return
  }

  // Order status
  if (data.startsWith('order_status_')) {
    const orderId = data.replace('order_status_', '')
    await showOrderStatus(ctx, orderId)
    await ctx.answerCallbackQuery()
    return
  }

  // If nothing matches
  await ctx.answerCallbackQuery()
})

// ---------- Error Handling ----------
bot.catch((err) => {
  console.error('Bot error:', err)
})

// ---------- Set Bot Commands ----------
export async function setBotCommands() {
  await bot.api.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'products', description: 'Browse products' },
    { command: 'categories', description: 'Show all categories' },
    { command: 'carts', description: 'View your cart' },
    { command: 'orders', description: 'Your order history' },
    { command: 'help', description: 'Help & support' },
  ])
}

setBotCommands().catch(console.error)