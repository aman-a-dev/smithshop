import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Award,
  BadgeCheck,
  Clock,
  Coins,
  Globe,
  HeartHandshake,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'About Us | SmithShop',
  description:
    'Learn about SmithShop – your trusted store for game credits, VPNs, and digital subscriptions since 2020.',
  keywords: [
    'about smithshop',
    'game topup company',
    'digital store',
    'trusted seller',
    'vpn subscriptions',
    'game credits',
  ],
}

const stats = [
  { icon: Users, label: 'Happy Customers', value: '50K+' },
  { icon: Coins, label: 'Transactions Processed', value: '120K+' },
  { icon: Globe, label: 'Countries Served', value: '85+' },
  { icon: Star, label: 'Average Rating', value: '4.9★' },
]

const values = [
  {
    icon: ShieldCheck,
    title: 'Security First',
    description:
      'Your data and transactions are protected with enterprise-grade encryption and security protocols.',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    description:
      'Get your digital purchases delivered in seconds, not hours. We value your time.',
  },
  {
    icon: HeartHandshake,
    title: 'Customer Obsession',
    description:
      'We go above and beyond to ensure every customer has a seamless experience.',
  },
  {
    icon: BadgeCheck,
    title: 'Trusted & Verified',
    description:
      'We are a verified digital store with thousands of positive reviews from real users.',
  },
]

const milestones = [
  { year: '2020', title: 'Founded', description: 'SmithShop was born with a mission to simplify digital top-ups.' },
  { year: '2021', title: '1,000 Customers', description: 'Reached our first 1,000 happy customers milestone.' },
  { year: '2022', title: 'Global Expansion', description: 'Expanded services to 50+ countries worldwide.' },
  { year: '2023', title: '50K+ Served', description: 'Surpassed 50,000 customers with a 4.9★ rating.' },
  { year: '2024', title: 'New Horizons', description: 'Launched VPN subscriptions and expanded game title support.' },
]

const trustBadges = [
  { icon: ShieldCheck, label: 'SSL Secured' },
  { icon: Clock, label: '24/7 Support' },
  { icon: Award, label: 'Top Rated Seller' },
  { icon: Sparkles, label: 'Instant Delivery' },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b  from-background via-background to-primary/10  py-24 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Rocket className="size-4 text-primary" />
              <span>Since 2020</span>
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              About{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SmithShop
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Your trusted destination for game credits, VPN subscriptions, and digital
              top-ups. We make digital purchases simple, fast, and secure.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/shop"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'inline-flex items-center justify-center'
                )}
              >
                Browse Products
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'inline-flex items-center justify-center'
                )}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center space-y-2 rounded-xl bg-background p-6 text-center shadow-sm transition hover:shadow-md"
                >
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <span className="text-2xl font-bold md:text-3xl">
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-2 border-primary/10 shadow-lg">
              <CardHeader>
                <div className="mb-2 inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Rocket className="size-6" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
                <CardDescription className="text-base">
                  To democratize access to digital goods by making top-ups and
                  subscriptions instantly available to everyone, everywhere.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe that digital access should be frictionless. Whether
                  you are a gamer looking to level up, a professional needing a
                  secure VPN, or someone subscribing to their favorite service,
                  SmithShop is here to make it happen in seconds.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 shadow-lg">
              <CardHeader>
                <div className="mb-2 inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Globe className="size-6" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
                <CardDescription className="text-base">
                  To become the world&apos;s most trusted digital marketplace for
                  games, VPNs, and subscriptions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We envision a future where anyone, anywhere, can access the
                  digital goods they need with just a few clicks. We are building
                  the infrastructure to make that future a reality today.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== VALUES SECTION ===== */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              What We Stand For
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our core values guide everything we do — from product selection to
              customer support.
            </p>
            <Separator className="mx-auto mt-4 w-24" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card
                  key={index}
                  className="border-0 bg-background shadow-md transition hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-2 inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-6" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES + CTA ===== */}
      <section className="border-t bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-2xl border bg-background p-8 shadow-md md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">
                  Why Choose SmithShop?
                </h2>
                <p className="mb-6 text-muted-foreground">
                  We are committed to providing the best digital shopping
                  experience. Here is why thousands of customers trust us.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {trustBadges.map((badge, index) => {
                    const Icon = badge.icon
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
                      >
                        <Icon className="size-4 text-primary" />
                        <span>{badge.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col items-start gap-4 rounded-xl bg-primary/5 p-6 md:items-center md:p-8">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <HeartHandshake className="size-8" />
                </div>
                <h3 className="text-xl font-semibold">
                  Ready to get started?
                </h3>
                <p className="text-center text-sm text-muted-foreground">
                  Join thousands of happy customers and experience the SmithShop
                  difference.
                </p>
                <Link
                  href="/shop"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'mt-2 inline-flex items-center justify-center'
                  )}
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}