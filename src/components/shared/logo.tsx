'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Image from 'next/image'

import LightLogo from '../../../public/icons/smithshop-logo-light.svg'
import DarkLogo from '../../../public/icons/smithshop-logo-dark.svg'

export default function Logo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'
  const logoSrc = isDark ? LightLogo : DarkLogo
  const width = 70
  const height = 100

  // Placeholder to prevent layout shift
  if (!mounted) {
    return <div style={{ width, height }} aria-hidden="true" />
  }

  return (
    <Image
      src={logoSrc}
      alt="Smithshop Logo"
      width={width}
      height={height}
      className="h-auto w-auto"
      priority
    />
  )
}