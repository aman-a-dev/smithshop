'use client'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { JSX, SVGProps } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

export default function AuthPage() {
   const handleTelegramLogin = async () => {
      const { data, error } = await authClient.signIn.telegram({
         callbackURL: '/dashboard'
      })
      if (error) {
         toast.error(`An error occured ${error}`)
      }
   }
   const handleGoogleLogin = async () => {
      const { data, error } = await authClient.signIn.social({
         provider: 'google',
         callbackURL: '/products',
         errorCallbackURL: '/error'
      })
      if (error) {
         toast.error(`An error occured ${error}`)
      }
   }
   return (
      <div className="flex items-center justify-center min-h-dvh">
         <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
               <h2 className="text-balance text-center text-xl font-semibold text-foreground">
                  Log in or create account
               </h2>

               <Button
                  variant="outline"
                  className="inline-flex mt-10 mb-3 w-full items-center justify-center space-x-2 relative"
                  onClick={handleTelegramLogin}>
                  <TgIcon
                     className="size-5"
                     aria-hidden={true}
                  />
                  <span className="text-sm font-medium">
                     Sign in with Telegram
                  </span>
                  <Badge className="absolute -top-3 -right-2">
                     Recommended &#128165;
                  </Badge>
               </Button>
               <Button
                  variant="outline"
                  className="inline-flex mb-10 w-full items-center justify-center space-x-2"
                  onClick={handleGoogleLogin}>
                  <GoogleIcon
                     className="size-5"
                     aria-hidden={true}
                  />
                  <span className="text-sm font-medium">
                     Sign in with Google
                  </span>
               </Button>
               <p className="text-pretty mt-4 text-xs text-muted-foreground text-center">
                  By signing in, you agree to our{' '}
                  <Link
                     href="/legal"
                     className="underline underline-offset-4 font-black font-[cursive]">
                     terms of service
                  </Link>{' '}
                  and{' '}
                  <Link
                     href="/legal"
                     className="underline underline-offset-4 font-black ont-[cursive]">
                     privacy policy
                  </Link>
                  .
               </p>
            </div>
         </div>
      </div>
   )
}

const GoogleIcon = (
   props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) => (
   <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}>
      <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
   </svg>
)
const TgIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
   <svg
      fill="currentColor"
      viewBox="0 0 50 50"
      x="0px"
      y="0px"
      width="50"
      height="50"
      {...props}>
      <path d="M25,2c12.703,0,23,10.297,23,23S37.703,48,25,48S2,37.703,2,25S12.297,2,25,2z M32.934,34.375	c0.423-1.298,2.405-14.234,2.65-16.783c0.074-0.772-0.17-1.285-0.648-1.514c-0.578-0.278-1.434-0.139-2.427,0.219	c-1.362,0.491-18.774,7.884-19.78,8.312c-0.954,0.405-1.856,0.847-1.856,1.487c0,0.45,0.267,0.703,1.003,0.966	c0.766,0.273,2.695,0.858,3.834,1.172c1.097,0.303,2.346,0.04,3.046-0.395c0.742-0.461,9.305-6.191,9.92-6.693	c0.614-0.502,1.104,0.141,0.602,0.644c-0.502,0.502-6.38,6.207-7.155,6.997c-0.941,0.959-0.273,1.953,0.358,2.351	c0.721,0.454,5.906,3.932,6.687,4.49c0.781,0.558,1.573,0.811,2.298,0.811C32.191,36.439,32.573,35.484,32.934,34.375z"></path>
   </svg>
)

// export const metadata: Metadata = {
//   title: 'Sign In | SmithShop',
//   description:
//       'Sign in to your SmithShop account to manage orders, favourites, and subscriptions.',
//   keywords: ['sign in', 'login', 'account', 'game topup account']
// }
