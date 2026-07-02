import { Middleware } from 'grammy'
import { BotContext } from '../index'
import prisma from '@/lib/prisma'

export const authMiddleware: Middleware<BotContext> = async (ctx, next) => {
  if (!ctx.from) {
    await ctx.reply('Please start the bot first.')
    return
  }

  try {
    let user = await prisma.user.findFirst({
      where: { telegramId: String(ctx.from.id) },
    })

    if (!user) {
      const now = new Date()
      user = await prisma.user.create({
        data: {
          id: `user_${ctx.from.id}`,
          name: ctx.from.first_name + (ctx.from.last_name ? ` ${ctx.from.last_name}` : ''),
          email: `${ctx.from.id}@telegram.user`,
          emailVerified: true,
          telegramId: String(ctx.from.id),
          telegramUsername: ctx.from.username || undefined,
          createdAt: now,
          updatedAt: now,
        },
      })
    }

    if (user.banned) {
      await ctx.reply(
        '⛔ You have been banned from using this bot.\n' +
        (user.banReason ? `Reason: ${user.banReason}` : ''),
        { parse_mode: 'HTML' }
      )
      return
    }

    ctx.user = {
      id: user.id,
      telegramId: user.telegramId!,
      name: user.name,
      role: user.role || 'user',
      banned: user.banned || false,
      banReason: user.banReason || undefined,
    }

    await next()
  } catch (error) {
    console.error('Auth error:', error)
    await ctx.reply('⚠️ An error occurred. Please try again later.')
  }
}