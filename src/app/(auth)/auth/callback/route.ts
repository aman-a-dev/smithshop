// app/auth/callback/route.ts
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return NextResponse.redirect(new URL('/auth', process.env.BETTER_AUTH_URL))
  }

  const destination = session.user.role === 'admin' ? '/admin' : '/products'
  return NextResponse.redirect(new URL(destination, process.env.BETTER_AUTH_URL))
}