'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { flushSync } from 'react-dom'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
   /** Additional class names */
   className?: string
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
   const { setTheme, theme } = useTheme()
   const ref = React.useRef<HTMLButtonElement>(null)
   const [mounted, setMounted] = React.useState(false)

   React.useEffect(() => {
      setMounted(true)
   }, [])

   async function themeToggle() {
      if (!ref.current) return

      // Fallback for browsers without View Transitions API
      if (!document.startViewTransition) {
         setTheme(theme === 'dark' ? 'light' : 'dark')
         return
      }

      await document.startViewTransition(() => {
         flushSync(() => {
            setTheme(theme === 'dark' ? 'light' : 'dark')
         })
      }).ready

      const { top, left, width, height } = ref.current.getBoundingClientRect()
      const right = window.innerWidth - left
      const bottom = window.innerHeight - top
      const maxRadius = Math.hypot(Math.max(right, left), Math.max(bottom, top))

      document.documentElement.animate(
         {
            clipPath: [
               `circle(0px at ${left + width / 2}px ${top + height / 2}px)`,
               `circle(${maxRadius}px at ${left + width / 2}px ${top + height / 2}px)`
            ]
         },
         {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)'
         }
      )
   }

   if (!mounted) {
      return (
         <button
            className={cn('theme-toggle', className)}
            aria-label='Toggle theme'
            disabled
         >
            <span className='theme-toggle__icon'>
               <SunIcon />
            </span>
         </button>
      )
   }

   return (
      <button
         ref={ref}
         className={cn('theme-toggle', className)}
         onClick={themeToggle}
         aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
         type='button'
      >
         <span className='theme-toggle__icon'>
            <span
               className='theme-toggle__sun'
               aria-hidden='true'
            >
               <SunIcon />
            </span>
            <span
               className='theme-toggle__moon'
               aria-hidden='true'
            >
               <MoonIcon />
            </span>
         </span>
      </button>
   )
}

const SunIcon = () => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='theme-toggle__svg'
   >
      <circle
         cx='12'
         cy='12'
         r='4'
      />
      <path d='M12 2v2' />
      <path d='M12 20v2' />
      <path d='m4.93 4.93 1.41 1.41' />
      <path d='m17.66 17.66 1.41 1.41' />
      <path d='M2 12h2' />
      <path d='M20 12h2' />
      <path d='m6.34 17.66-1.41 1.41' />
      <path d='m19.07 4.93-1.41 1.41' />
   </svg>
)

const MoonIcon = () => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='theme-toggle__svg'
   >
      <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
   </svg>
)

export default ThemeToggle
