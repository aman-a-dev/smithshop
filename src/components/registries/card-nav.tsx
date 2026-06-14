'use client'

import {
   useLayoutEffect,
   useRef,
   useState,
   useCallback,
   useEffect
} from 'react'
import { gsap } from 'gsap'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Logo from '@/components/shared/logo'

type CardNavLink = {
   label: string
   ariaLabel: string
   url: string
}

export type CardNavItem = {
   label: string
   links: CardNavLink[]
}

export interface CardNavProps {
   items: CardNavItem[]
   className?: string
   ease?: string
}

export default function CardNav({
   items,
   className = '',
   ease = 'power3.inOut'
}: CardNavProps) {
   const [isExpanded, setIsExpanded] = useState(false)
   const navRef = useRef<HTMLDivElement | null>(null)
   const cardsRef = useRef<HTMLDivElement[]>([])
   const tlRef = useRef<gsap.core.Timeline | null>(null)
   const [isMounted, setIsMounted] = useState(false)

   // Measure dynamic height for content area
   const calculateHeight = useCallback(() => {
      const navEl = navRef.current
      if (!navEl) return 60

      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement
      if (contentEl) {
         const topBarHeight = 60
         const contentHeight = contentEl.scrollHeight
         const paddingBottom = 12 // Buffer
         return topBarHeight + contentHeight + paddingBottom
      }
      return 60
   }, [])

   // Initialize timeline and state
   useLayoutEffect(() => {
      const navEl = navRef.current
      if (!navEl) return

      // Initial state: ensure it's closed on mount
      gsap.set(navEl, { height: 60, overflow: 'hidden' })
      gsap.set(cardsRef.current, { y: 20, opacity: 0 })

      const tl = gsap.timeline({
         paused: true,
         defaults: { ease }
      })

      tl.to(navEl, {
         height: calculateHeight,
         duration: 0.5
      })

      tl.to(
         cardsRef.current,
         {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05
         },
         '-=0.3'
      )

      tlRef.current = tl
      setIsMounted(true)

      return () => {
         tl.kill()
      }
   }, [calculateHeight, ease])

   // Handle Resize
   useEffect(() => {
      const handleResize = () => {
         if (!tlRef.current || !isExpanded) return
         gsap.to(navRef.current, {
            height: calculateHeight(),
            duration: 0.3,
            ease: 'power2.out'
         })
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
   }, [isExpanded, calculateHeight])

   // Trigger Animation
   useEffect(() => {
      if (!tlRef.current || !isMounted) return

      if (isExpanded) {
         tlRef.current.play()
      } else {
         tlRef.current.reverse()
      }
   }, [isExpanded, isMounted])

   const toggleMenu = () => setIsExpanded(prev => !prev)

   // Reset cards ref array on render
   cardsRef.current = []

   return (
      <nav
         ref={navRef}
         className={cn(
            'fixed top-4 inset-x-0 mx-auto w-[95%] max-w-7xl',
            'bg-background/95 backdrop-blur-md border border-border shadow-2xl rounded-[32px] z-50 overflow-hidden',
            'h-[60px] md:max-h-max',
            className
         )}
      >
         {/* Top Bar */}
         <div className='h-[60px] px-6 flex items-center justify-between'>
            <Link
               href='/'
               className='relative flex items-center h-8 w-28 shrink-0'
            >
               <Logo />
            </Link>

            <button
               onClick={toggleMenu}
               aria-expanded={isExpanded}
               aria-label='Toggle navigation menu'
               className={cn(
                  'group flex items-center gap-3 px-5 py-2 rounded-full transition-all duration-300',
                  'bg-primary text-primary-foreground hover:opacity-90 active:scale-95'
               )}
            >
               <span className='text-xs font-bold uppercase tracking-wider select-none'>
                  {isExpanded ? 'Close' : 'Menu'}
               </span>

               {/* Fixed Hamburger Icon Animation */}
               <div className='relative w-4 h-3.5 flex flex-col justify-between items-center'>
                  <span
                     className={cn(
                        'w-full h-0.5 bg-current rounded-full transition-all duration-300 transform origin-center',
                        isExpanded ? 'rotate-45 translate-y-[6px]' : ''
                     )}
                  />
                  <span
                     className={cn(
                        'w-full h-0.5 bg-current rounded-full transition-all duration-200',
                        isExpanded ? 'opacity-0 scale-x-0' : 'opacity-100'
                     )}
                  />
                  <span
                     className={cn(
                        'w-full h-0.5 bg-current rounded-full transition-all duration-300 transform origin-center',
                        isExpanded ? '-rotate-45 -translate-y-[6px]' : ''
                     )}
                  />
               </div>
            </button>
         </div>

         {/* Collapsible Content */}
         <div className='card-nav-content px-6 pb-8'>
            <div
               className='grid gap-4 pt-4'
               style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
               }}
            >
               {items.map((item, index) => (
                  <div
                     key={index}
                     ref={el => {
                        if (el) cardsRef.current[index] = el
                     }}
                     className='p-6 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors flex flex-col justify-between min-h-[160px]'
                  >
                     <div>
                        <h3 className='text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4'>
                           {item.label}
                        </h3>
                        <ul className='space-y-3'>
                           {item.links.map((link, lIndex) => (
                              <li key={lIndex}>
                                 <Link
                                    href={link.url}
                                    aria-label={link.ariaLabel}
                                    className='group inline-flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary transition-colors'
                                 >
                                    {link.label}
                                    <ExternalLink className='w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all' />
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </nav>
   )
}
