'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { updateOrderStatus, type OrderWithRelations } from '@/action/admin'
import { formatETB, formatDate } from '@/utils/format'

const STATUS_OPTIONS = [
  'PENDING',
  'AWAITING_PAYMENT',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'REFUNDED',
] as const

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  COMPLETED: 'default',
  PENDING: 'secondary',
  AWAITING_PAYMENT: 'secondary',
  PROCESSING: 'outline',
  FAILED: 'destructive',
  CANCELLED: 'destructive',
  REFUNDED: 'outline',
}

export function OrderTable({ initialOrders }: { initialOrders: OrderWithRelations[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleStatusChange(orderId: string, status: string) {
    startTransition(async () => {
      const result = await updateOrderStatus({ id: orderId, status })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(`Order marked ${status.toLowerCase().replace('_', ' ')}`)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">Orders are created by customers at checkout.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
              {initialOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div>{order.user.name}</div>
                    <div className="text-xs text-muted-foreground">{order.user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5 text-sm">
                      {order.items.map(item => (
                        <div key={item.id}>
                          {item.quantity}× {item.package.label}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{formatETB(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={v => handleStatusChange(order.id, v)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-[160px] h-8">
                        <SelectValue>
                          <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'}>
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(s => (
                          <SelectItem key={s} value={s}>
                            {s.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
