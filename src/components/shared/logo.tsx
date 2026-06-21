'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'

import LightLogo from '../../../public/icons/smithshop-logo-light.svg'
import DarkLogo from '../../../public/icons/smithshop-logo-dark.svg'

export default function Logo() {
   const { resolvedTheme } = useTheme()

   // resolvedTheme is undefined on the server, so we render a placeholder
   // to avoid hydration mismatch; once resolved, we show the image.
   if (resolvedTheme === undefined) {
      return <div style={{ width: 70, height: 100 }} aria-hidden="true" />
   }

   const isDark = resolvedTheme === 'dark'
   const logoSrc = isDark ? LightLogo : DarkLogo

   return (
      <Image
         src={logoSrc}
         alt="Smithshop Logo"
         width={70}
         height={100}
         className="h-auto"
         priority
      />
   )
}