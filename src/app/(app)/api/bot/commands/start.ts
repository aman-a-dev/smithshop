import { BotContext } from '../index'
import { getMainKeyboard } from '@/app/(app)/api/bot/keyboard/keyboards'

export async function startCommand(ctx: BotContext) {
  const userName = ctx.from?.first_name || 'User'
  const welcome = `
<b>👋 Welcome to <a href="https://smithshop.vercel.app">SmithTOPUP</a>, ${userName}!</b>

<b>🎮 What We Offer:</b>
• Gaming Top‑Ups – Free Fire, Mobile Legends, PUBG, etc.
• Social Media Premium – Telegram, Discord, Netflix
• In‑Game Currency – Diamonds, UC, Robux, and more

<b>⚡ Quick Start:</b>
1️⃣ Click <b>🛍️ Products</b> to browse items
2️⃣ Select a category and product
3️⃣ Choose a package – add to cart or buy now
4️⃣ Enter your Game ID and complete payment

<b>💡 Tips:</b>
• Check your orders with <b>📦 Orders</b>
• Need help? Click <b>🆘️ Help</b>

<b>🔗 Connect with us:</b>
• Website: smithshop.vercel.app
• Support: 24/7
  `
  await ctx.reply(welcome, {
    reply_markup: getMainKeyboard(),
    parse_mode: 'HTML',
    link_preview_options: { is_disabled: true },
  })
}