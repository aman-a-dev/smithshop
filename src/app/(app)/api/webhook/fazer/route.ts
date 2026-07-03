// app/api/webhook/fazer/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const signature = req.headers.get('x-fazer-signature')

  // Verify signature
  const secret = process.env.FAZER_WEBHOOK_SECRET
  if (!secret) {
    console.error('Missing FAZER_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex')
  if (signature !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(payload)

  // Handle event types as per FazerCards docs
  if (event.type === 'order.completed') {
    const { ref, status } = event.data // adjust to actual fields

    // Find order by fulfilmentRef (set during Chapa webhook)
    const order = await prisma.order.findFirst({
      where: {
        fulfilmentRef: ref,
      },
    })

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          fulfilmentRaw: event.data,
        },
      })
    } else {
      console.warn('Order not found for Fazer ref:', ref)
    }
  }

  return NextResponse.json({ received: true })
}