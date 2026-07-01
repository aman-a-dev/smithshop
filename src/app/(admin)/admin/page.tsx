import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, ShoppingBag, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getDashboardStats } from '@/action/admin'
import { formatETB } from '@/utils/format'

const ICONS = {
  Balance: Wallet,
  'Total Users': Users,
  Products: Package,
  Orders: ShoppingBag,
} as const

export default async function AdminOverview() {
  const result = await getDashboardStats()

  if (!result.success) {
    return <div className="p-6 text-red-600">Failed to load stats: {result.error}</div>
  }

  const stats = result.data

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => {
          const Icon = ICONS[stat.title as keyof typeof ICONS] ?? Wallet
          const displayValue = stat.title === 'Balance' ? formatETB(stat.value) : stat.value.toLocaleString()

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayValue}</div>
                {/* No historical snapshot to diff against yet — omit the
                    fabricated "+X% from last month" line rather than fake it. */}
                <Button asChild variant="link" className="mt-1 h-auto p-0">
                  <Link href={`/admin${stat.url}`}>Explore →</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
