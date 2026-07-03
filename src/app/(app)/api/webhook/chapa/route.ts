// app/api/webhook/chapa/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { placeFazerOrder } from '@/lib/fazer'

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const signature = req.headers.get('x-chapa-signature')

  // 1. Verify signature (optional but recommended)
  const secret = process.env.CHAPA_WEBHOOK_SECRET || process.env.CHAPA_SECRET_KEY
  if (secret) {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex')
    if (signature !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  // 2. Parse event
  const event = JSON.parse(payload)

  // 3. Handle event
  if (event.event === 'charge.success') {
    const txRef = event.data.tx_ref // e.g., "payment_<paymentId>"
    const paymentId = txRef.replace('payment_', '')

    // Find payment with order and items
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            items: {
              include: { package: true },
            },
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        paidAt: new Date(),
        providerRaw: event.data,
      },
    })

    // Update order status to PROCESSING (payment received)
    const order = payment.order
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PROCESSING' },
    })

    // 4. Trigger FazerCards order fulfillment for each item
    try {
      for (const item of order.items) {
        const pkg = item.package
        if (!pkg.sku) {
          console.error(`Package ${pkg.id} missing SKU; cannot fulfill.`)
          continue
        }
        const { ref } = await placeFazerOrder(pkg.sku, order.targetId!, item.quantity)
        // Store the ref in the order (if multiple items, you may need to store per item or concatenate)
        await prisma.order.update({
          where: { id: order.id },
          data: { fulfilmentRef: ref },
        })
      }
      // Optionally set order status to PROCESSING (already set) – Fazer webhook will set to COMPLETED later.
    } catch (error) {
      console.error('Fazer order placement failed:', error)
      // Could set order to FAILED or keep as PROCESSING with retry logic
    }

    return NextResponse.json({ received: true })
  }

  // Acknowledge other events
  return NextResponse.json({ received: true })
}

export const dynamic = 'force-dynamic'