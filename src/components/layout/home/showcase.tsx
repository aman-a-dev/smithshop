'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { motion, useTransform, MotionValue } from 'motion/react'
import { useEffect, useRef } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import { useScroll, cancelFrame, frame } from 'motion/react'
import { ReactLenis } from 'lenis/react'
import type { LenisRef } from 'lenis/react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface CardProps {
   id: number
   className?: string
   progress: MotionValue<number>  // fixed: explicitly typed
   range: number[]
   targetScale: number
   children?: React.ReactNode
}

function ParallaxCardEffect({
   id,
   className,
   progress,
   range,
   targetScale,
   children
}: CardProps) {
   const scale = useTransform(progress, range, [1, targetScale])

   return (
      <div className='sticky top-0 flex h-screen items-center justify-center'>
         <motion.div
            style={{
               scale,
               top: `calc(-5vh + ${id * 30}px)`
            }}
            className={className}
         >
            {children}
         </motion.div>
      </div>
   )
}

const cardItems = [
   {
      title: 'Roblox',
      description:
         'Get Robux and exclusive bundles to power up games and creations — safe purchases, instant top-up.',
      src: '/assets/rb.png'
   },
   {
      title: 'Instagram Followers',
      description:
         'Grow your presence with real-appearing followers — affordable packages, quick boost to visibility.',
      src: '/assets/ig.png'
   },
   {
      title: 'FreeFire Diamond',
      description:
         'Buy diamonds for skins, lootboxes and upgrades — lowest ETB rates, instant and reliable delivery.',
      src: '/assets/ff2.png'
   },
   {
      title: 'PUBG UC',
      description:
         'Top up UC for crates, passes and cosmetics — trusted service, fast fulfillment and competitive prices.',
      src: '/assets/pg.png'
   },
   {
      title: 'Telegram Stars',
      description:
         'Support creators quickly with Stars — simple purchase, immediate credit, perfect for gifting.',
      src: '/assets/tgs.png'
   },
   {
      title: 'Telegram Premium',
      description:
         'Activate Premium subscriptions instantly — premium perks unlocked with safe and hassle-free delivery.',
      src: '/assets/tg.png'
   },
   {
      title: 'eFootball Coins',
      description:
         'Buy coins to strengthen your squad and transfers — instant credit with reliable, secure delivery.',
      src: '/assets/efb.png'
   },
   {
      title: 'TikTok Coins',
      description:
         'Boost gifting power and engagement with TikTok Coins — fast delivery and budget-friendly bundles.',
      src: '/assets/tt.png'
   },
   {
      title: 'Blood Strike',
      description:
         'Purchase diamonds and premium extras for exclusive skins — secure checkout, rapid activation.',
      src: '/assets/bs.png'
   },
   {
      title: 'Call of Duty',
      description:
         'Top up CP for battle passes and cosmetics — competitive pricing and dependable delivery every time.',
      src: '/assets/cod.png'
   }
]
export type CardItemType = (typeof cardItems)[number]

export default function ShowCase() {
   const lenisRef = useRef<LenisRef>(null)
   const containerRef = useRef<HTMLDivElement>(null)

   const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ['start start', 'end end']
   })

   useEffect(() => {
      function update(data: { timestamp: number }) {
         const time = data.timestamp
         lenisRef.current?.lenis?.raf(time)
      }

      frame.update(update, true)

      return () => cancelFrame(update)
   }, [])

   const ParallaxCardItem = ({
  item,
  id
}: {
  item: CardItemType
  id: number
}) => {
  const targetScale = 1 - (cardItems.length - id) * 0.05

  return (
    <ParallaxCardEffect
      id={id}
      progress={scrollYProgress}
      range={[id * 0.25, 1]}
      targetScale={targetScale}
      className={cn(
        'relative flex flex-col rounded-xl px-14 py-8 shadow-2xl bg-background'
      )}
    >
      <div className="space-y-4 text-center relative">
        <Image
          src={item.src}
          alt={item.title}
          width={0}
          height={0}
          sizes="100px"
          style={{ width: '100px', height: '100px' }}
          className="absolute -top-28 mx-auto rounded"
          loading={id === 0 ? 'eager' : 'lazy'}
          priority={id === 0}
        />
        <h4 className="font-heading text-center text-3xl">{item.title}</h4>
        <p className="text-balance opacity-80">{item.description}</p>
        <Button>
          Explore <ChevronRightIcon />
        </Button>
      </div>
    </ParallaxCardEffect>
  )
}

   return (
      <>
         <ReactLenis
            root
            options={{ autoRaf: false }}
            ref={lenisRef}
         />
         <div ref={containerRef}>
            <div className='flex h-[400px] items-center justify-center gap-2 text-xl'>
               Our Products <ChevronDownIcon />
            </div>
            <div className='mx-auto max-w-2xl pt-14'>
               {cardItems.map((cardItem, i) => (
                  <ParallaxCardItem
                     item={cardItem}
                     key={i}
                     id={i}
                  />
               ))}
            </div>
         </div>
      </>
   )
}