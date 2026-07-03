import axios from 'axios'

interface ChapaInitResponse {
  data: {
    checkout_url: string
    transaction_id: string
  }
  status: string
  message: string
}

export async function initializeChapaPayment(
  paymentId: string,
  amount: number,
  email: string,
  firstName: string,
  lastName?: string,
  phone?: string
): Promise<{ checkoutUrl: string; txRef: string }> {
  const amountInETB = (amount / 100).toFixed(2)
  const baseURL = process.env.CHAPA_API_URL || 'https://api.chapa.co/v1'
  const secretKey = process.env.CHAPA_SECRET_KEY
  if (!secretKey) throw new Error('CHAPA_SECRET_KEY missing')

  const payload = {
    amount: amountInETB,
    currency: 'ETB',
    email,
    first_name: firstName,
    last_name: lastName || '',
    phone_number: phone || '',
    tx_ref: `payment_${paymentId}`,
    callback_url: process.env.CHAPA_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/chapa`,
    return_url: process.env.CHAPA_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL}/orders`,
    customization: {
      title: 'SmithTOPUP',
      description: 'Top-up purchase',
      logo: 'https://smithshop.vercel.app/icons/logo.png',
    },
  }

  const response = await axios.post<ChapaInitResponse>(
    `${baseURL}/transaction/initialize`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    }
  )

  if (response.data.status !== 'success') {
    throw new Error(`Chapa initialization failed: ${response.data.message}`)
  }

  return {
    checkoutUrl: response.data.data.checkout_url,
    txRef: response.data.data.transaction_id,
  }
}