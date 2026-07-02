import { BotContext } from '../index'

export async function helpCommand(ctx: BotContext) {
  const msg = `
<b>🆘️ Help Center – 24/7 Support</b>

<b>📋 Quick Guide:</b>
1. <b>🛍️ Products</b> – Browse available top‑ups
2. <b>📦 Orders</b> – Check your order history
3. <b>🛒 Cart</b> – Manage your items

<b>❓ Frequently Asked Questions:</b>
<b>Q:</b> How long does delivery take?
<b>A:</b> Most orders are delivered within 1–5 minutes

<b>Q:</b> What payment methods are accepted?
<b>A:</b> We accept Chapa (Tele Birr)

<b>Q:</b> Is my information secure?
<b>A:</b> Yes, all data is encrypted and secure

<b>Q:</b> What if I don't receive my order?
<b>A:</b> Contact support immediately

<b>📞 Support Contacts:</b>
• Telegram: @Smithdshop1
• Website: smithshop.vercel.app

<b>🕐 Support Hours:</b>
24/7 – We're always here!

<b>Developer:</b>
if you like to have bot like this meet the developer @Aman_a_dev
  `

  await ctx.reply(msg, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: '📞 Contact Support', callback_data: 'contact_support' }],
        [{ text: '🔄 Back to Menu', callback_data: 'back_to_menu' }],
      ],
    },
  })
}