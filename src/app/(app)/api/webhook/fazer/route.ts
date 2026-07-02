import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  // 1. Get the raw payload and headers
  const payload = await req.text()
  const signature = req.headers.get('x-fazer-signature') // Use req.headers directly

  // 2. Validate the webhook signature
  if (!isValidSignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // 3. Parse payload into JSON
  const event = JSON.parse(payload)

  // 4. Handle the specific FazerCards event
  switch (event.type) {
    case 'order.created':
      console.log('Order received:', event.data.orderId)
      break
    case 'order.completed':
      console.log('Order fulfilled:', event.data)
      break
    default:
      console.log('Unhandled event type:', event.type)
  }

  // 5. Always return a 200 to acknowledge receipt
  return NextResponse.json({ received: true }, { status: 200 })
}

function isValidSignature(payload: string, signature: string | null): boolean {
  if (!signature) return false

  const secret = process.env.FAZER_WEBHOOK_SECRET
  if (!secret) {
    console.error('Missing FAZER_WEBHOOK_SECRET')
    return false
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex') // adjust to 'base64' if Fazer uses that

    const trustedBuffer = Buffer.from(expectedSignature, 'ascii')
    const receivedBuffer = Buffer.from(signature, 'ascii')

    if (trustedBuffer.length !== receivedBuffer.length) return false

    return crypto.timingSafeEqual(trustedBuffer, receivedBuffer)
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}