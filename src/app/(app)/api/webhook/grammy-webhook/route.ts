/*
import { Bot, webhookCallback } from 'grammy'
import { NextRequest, NextResponse } from 'next/server'
import { bot } from '@/lib/bot'

const handleUpdate = webhookCallback(bot, 'nextjs')

export async function POST(req: NextRequest) {
   try {
      const res = await handleUpdate(req)
      return res
   } catch (err) {
      console.error('Error handling update:', err)
      return NextResponse.json({ error: 'Invalid update' }, { status: 500 })
   }
}
*/
