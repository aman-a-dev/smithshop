import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, ShoppingBag, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getDashboardStats } from '@/action/admin'

export default async function AdminOverview() {
   const result = await getDashboardStats()

   if (!result.success) {
      return (
         <div className="p-6 text-red-600">
            Failed to load stats: {result.error}
         </div>
      )
   }

   const stats = result.data!

   return (
      <div className="space-y-6">
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map(stat => {
               const IconMap = {
                  Balance: Wallet,
                  'Total Users': Users,
                  Products: Package,
                  Orders: ShoppingBag
               }
               const Icon =
                  IconMap[stat.title as keyof typeof IconMap] || Wallet
               return (
                  <Card key={stat.title}>
                     <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                           {stat.title}
                        </CardTitle>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">
                           {stat.value.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                           {stat.change} from last month
                        </p>
                        <Button
                           className="mt-1">
                           <Link href={`/admin${stat.url}`}>Explore</Link>
                        </Button>
                     </CardContent>
                  </Card>
               )
            })}
         </div>
      </div>
   )
}
