import { webhookCallback } from 'grammy'
import { NextRequest, NextResponse } from 'next/server'
import { bot } from './index'

export async function POST(req: NextRequest) {
  try {
    const handler = webhookCallback(bot, 'next' as any) // use 'next' adapter
    const res = await handler(req)
    return res
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Invalid update' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'