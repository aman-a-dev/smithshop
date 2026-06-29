// import { headers } from 'next/headers'
// import { NextResponse,NextRequest } from 'next/server'
// import crypto from 'crypto'

// export async function POST(req: NextRequest) {
//   // 1. Get the raw payload and headers
//   const payload = await req.text()
//   const headersList = headers()
//   const signature = headersList.get('x-fazer-signature') // Verify actual header name in FazerCards docs

//   // 2. Validate the webhook signature (example security check)
//   // Replace this with your actual HMAC verification logic
//   if (!isValidSignature(payload, signature)) {
//       return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
//   }

//   // 3. Parse payload into JSON
//   const event = JSON.parse(payload)

//   // 4. Handle the specific FazerCards event
//   switch (event.type) {
//       case 'order.created':
//         // Handle successful creation
//         console.log('Order received:', event.data.orderId)
//         break
//       case 'order.completed':
//         // Handle successful delivery (e.g., reveal code or update UI)
//         console.log('Order fulfilled:', event.data)
//         break
//       default:
//         console.log('Unhandled event type:', event.type)
//   }

//   // 5. Always return a 200 to acknowledge receipt
//   return NextResponse.json({ received: true }, { status: 200 })
// }

// function isValidSignature(payload: string, signature: string | null): boolean {
//   // 1. Fail immediately if the header is missing
//   if (!signature) {
//       return false
//   }

//   // 2. Fetch the secret key from environment variables
//   const secret = process.env.FAZER_WEBHOOK_SECRET
//   if (!secret) {
//       console.error('Missing FAZER_WEBHOOK_SECRET in environment variables.')
//       return false
//   }

//   try {
//       // 3. Generate the expected HMAC SHA256 hash from the raw text payload
//       const expectedSignature = crypto
//         .createHmac('sha256', secret)
//         .update(payload, 'utf8')
//         .digest('hex') // Change to 'base64' if FazerCards uses base64 encoding

//       // 4. Safely compare the expected signature against the provided one
//       const trustedBuffer = Buffer.from(expectedSignature, 'ascii')
//       const receivedBuffer = Buffer.from(signature, 'ascii')

//       if (trustedBuffer.length !== receivedBuffer.length) {
//         return false
//       }

//       return crypto.timingSafeEqual(trustedBuffer, receivedBuffer)
//   } catch (error) {
//       console.error('Signature verification error:', error)
//       return false
//   }
// }
