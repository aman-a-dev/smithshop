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
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatETB, formatDate } from '@/utils/format'
import type { TransactionWithRelations } from '@/action/admin'

const PAYMENT_STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  SUCCESS: 'default',
  PENDING: 'secondary',
  INITIATED: 'secondary',
  FAILED: 'destructive',
  EXPIRED: 'destructive',
  REFUNDED: 'outline',
}

export function TransactionTable({ transactions }: { transactions: TransactionWithRelations[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No transactions yet.
                </TableCell>
              </TableRow>
            )}
            {transactions.map(tx => {
              const isCredit = tx.amount >= 0
              const status = tx.payment?.status ?? null
              return (
                <TableRow key={tx.id}>
                  <TableCell className="flex items-center gap-2">
                    {isCredit ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    {isCredit ? 'Credit' : 'Debit'}
                  </TableCell>
                  <TableCell>{tx.user.name}</TableCell>
                  <TableCell className={isCredit ? 'text-green-600' : 'text-red-600'}>
                    {isCredit ? '+' : ''}
                    {formatETB(tx.amount)}
                  </TableCell>
                  <TableCell>{formatDate(tx.createdAt)}</TableCell>
                  <TableCell>
                    {status ? (
                      <Badge variant={PAYMENT_STATUS_VARIANT[status] ?? 'outline'}>{status}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
