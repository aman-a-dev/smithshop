import { NextRequest, NextResponse } from 'next/server'
import { bot } from './index'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const update = JSON.parse(body)
    await bot.handleUpdate(update)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Invalid update' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'