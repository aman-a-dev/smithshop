import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import { hulkFont } from '@/fonts/font'
import { BounceCards } from '@/components/registries/bounce-cards'
import { TextEffect } from '@/components/registries/text-effect'

import { HeroSearch } from './hero-search'

const images = [
  '/assets/ff.png',
  '/assets/tg.png',
  '/assets/bs.png',
  '/assets/cd.png',
  '/assets/pg.png'
]

const transformStyles = [
  'rotate(5deg) translate(-150px)',
  'rotate(0deg) translate(-70px)',
  'rotate(-5deg)',
  'rotate(5deg) translate(70px)',
  'rotate(-5deg) translate(150px)'
]

export default function Hero() {
  return (
    <section className="container mx-auto px-6 py-12 md:py-20 flex flex-col items-center gap-16 min-h-[90vh] justify-center">
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="flex-1 text-center md:text-left space-y-4">
          <TextEffect
            preset="fade-in-blur"
            speedReveal={1.1}
            speedSegment={0.3}
            className={`${hulkFont.className} scroll-m-20 text-4xl md:text-6xl font-extrabold tracking-tight text-balance leading-[1.1]`}
          >
            Level up your digital arsenal
          </TextEffect>

          <p className="max-w-[500px] mx-auto md:mx-0 text-muted-foreground text-base md:text-lg font-medium opacity-80">
            Ethiopia's most secure marketplace for instant{' '}
            <b className="font-[cursive] text-foreground">gaming</b> top-ups
            and{' '}
            <b className="font-[cursive] text-foreground">Social media</b>{' '}
            premium subscriptions.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start gap-5 w-full md:w-auto">
          <Suspense fallback={null}>
            <HeroSearch />
          </Suspense>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 hover:bg-primary hover:text-primary-foreground"
            >
              Freefire
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 hover:bg-primary hover:text-primary-foreground"
            >
              PUBG UC
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 hover:bg-primary hover:text-primary-foreground"
            >
              Telegram
            </Button>
          </div>
        </div>
      </div>

      <div className="w-screen flex justify-center items-center overflow-scroll py-12">
        <div className="relative left-10 flex justify-center items-center w-full max-w-[500px]">
          <BounceCards
            className="custom-bounceCards"
            images={images}
            containerWidth={500}
            containerHeight={250}
            animationDelay={1}
            animationStagger={0.08}
            easeType="elastic.out(1, 0.5)"
            transformStyles={transformStyles}
            enableHover
          />
        </div>
      </div>
    </section>
  )
}



