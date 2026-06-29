import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Plus } from 'lucide-react'
import { getOrders } from '@/action/admin'

export default async function OrdersPage() {
   const result = await getOrders()

   if (!result.success) {
      return (
         <div className="p-6 text-red-600">
            Failed to load orders: {result.error}
         </div>
      )
   }

   const orders = result.data!

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Orders</h1>
            <Button>
               <Plus className="mr-2 h-4 w-4" />
               New Order
            </Button>
         </div>

         <Card>
            <CardHeader>
               <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {orders.map(order => (
                        <TableRow key={order.id}>
                           <TableCell className="font-medium">
                              {order.id}
                           </TableCell>
                           <TableCell>{order.user}</TableCell>
                           <TableCell>{order.amount}</TableCell>
                           <TableCell>
                              <Badge
                                 variant={
                                    order.status === 'Completed'
                                       ? 'default'
                                       : order.status === 'Pending'
                                         ? 'secondary'
                                         : order.status === 'Failed'
                                           ? 'destructive'
                                           : 'outline'
                                 }>
                                 {order.status}
                              </Badge>
                           </TableCell>
                           <TableCell>{order.date}</TableCell>
                           <TableCell className="text-right">
                              <Button
                                 variant="ghost"
                                 size="sm">
                                 <MoreHorizontal className="h-4 w-4" />
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
      </div>
   )
}
