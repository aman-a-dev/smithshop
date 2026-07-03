'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JSX, SVGProps, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react' // or any spinner icon

export default function AuthPage() {
  const router = useRouter()
  const [telegramLoading, setTelegramLoading] = useState(true)
  const [telegramError, setTelegramError] = useState<string | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    try {
      // Initialize the Telegram widget
      authClient.initTelegramWidget(
        'telegram-login-container',
        { size: 'large', cornerRadius: 20 },
        async (authData) => {
          // This callback runs when the user clicks the Telegram login button
          setTelegramLoading(false) // not strictly necessary, but safe
          const { data, error } = await authClient.signInWithTelegram(authData)

          if (error) {
            toast.error(`Authentication error: ${error.message}`)
            setTelegramError(error.message || 'Authentication failed')
            return
          }

          if (data) {
            toast.success('Successfully authenticated')
            const session = await authClient.getSession()
            redirectByRole(session.data?.user?.role)
          }
        }
      )

      // Give the widget up to 5 seconds to appear; if not, show a fallback
      timeout = setTimeout(() => {
        const container = document.getElementById('telegram-login-container')
        // Check if the widget's iframe exists
        const iframe = container?.querySelector('iframe')
        if (!iframe) {
          setTelegramError('Telegram widget failed to load. Please try again or use Google.')
          setTelegramLoading(false)
        } else {
          setTelegramLoading(false)
        }
      }, 5000)
    } catch (err) {
      setTelegramError((err as Error).message || 'Failed to initialize Telegram login')
      setTelegramLoading(false)
    }

    return () => clearTimeout(timeout)
  }, [])

  const redirectByRole = (role?: string | null) => {
    if (role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/products')
    }
  }

  const handleGoogleLogin = async () => {
    const { data, error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/auth/callback',
      errorCallbackURL: '/error'
    })
    if (error) {
      toast.error(`An error occurred: ${error.message}`)
    }
    if (data) {
      toast.success('Redirecting to Google...')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-balance text-center text-xl font-semibold text-foreground">
            Log in or create account
          </h2>

          <div className="mt-10 mb-3 relative">
            {/* Telegram widget container */}
            <div id="telegram-login-container" className="flex justify-center min-h-[60px]">
              {telegramLoading && (
                <div className="flex items-center justify-center w-full">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {telegramError && (
                <div className="text-sm text-destructive text-center w-full">
                  {telegramError}
                </div>
              )}
            </div>
            <Badge className="absolute -top-3 -right-2">
              Recommended ⚡
            </Badge>
          </div>

          <Button
            variant="outline"
            className="inline-flex mb-10 w-full items-center justify-center space-x-2"
            onClick={handleGoogleLogin}
          >
            <GoogleIcon className="size-5" aria-hidden={true} />
            <span className="text-sm font-medium">Sign in with Google</span>
          </Button>

          <p className="text-pretty mt-4 text-xs text-muted-foreground text-center">
            By signing in, you agree to our{' '}
            <Link href="/legal" className="underline underline-offset-4 font-black font-[cursive]">
              terms of service
            </Link>{' '}
            and{' '}
            <Link href="/legal" className="underline underline-offset-4 font-black font-[cursive]">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

const GoogleIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
)