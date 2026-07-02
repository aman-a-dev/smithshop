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

// ---------- Text & Callback Handlers ----------
// ... (keep the rest of your handlers as they are)

// ---------- Error Handling ----------
bot.catch((err) => {
  console.error('Bot error:', err)
})

// ---------- Lazy Initialization ----------
let initialized = false
export async function initializeBot() {
  if (!initialized) {
    await bot.init()
    initialized = true
    console.log('✅ Bot initialized')
  }
}

// ---------- Set Bot Commands (optional) ----------
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

// Auto-set commands when bot initializes (not required, but nice)
// We'll call it from the route after init.