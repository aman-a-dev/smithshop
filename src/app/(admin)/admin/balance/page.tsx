import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Info, Wallet, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'                     // ✅ added
import { getBalance } from '@/action/admin'
import { formatETB, formatDate } from '@/utils/format'           // ✅ added

export default async function BalancePage() {
  const result = await getBalance()

  if (!result.success) {
    return (
      <div className="p-6 text-red-600">
        Failed to load balance: {result.error}
      </div>
    )
  }

  const { balance, transactions } = result.data!

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">Balance</span>
            <Popover>
              <PopoverTrigger>
                <Info />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverDescription>
                  Each topup from users uses your active availability
                  balance. If your balance goes 0 all orders will be
                  automatically fail.
                </PopoverDescription>
              </PopoverContent>
            </Popover>
          </CardTitle>
          <CardDescription>Available topup balance</CardDescription>
        </CardHeader>
        <CardContent>
          <h1 className="font-black text-muted-foreground text-4xl">
            {formatETB(balance)}
          </h1>
          <div className="flex gap-2 mt-5">
            <Button>
              <Wallet className="mr-2 h-4 w-4" /> Add Fund
            </Button>
            <Button variant="secondary">
              <Plus className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => {
                const isCredit = tx.amount >= 0
                const type = isCredit ? 'Deposit' : 'Withdrawal'
                const status = tx.payment?.status ?? 'Unknown'
                const formattedAmount = (isCredit ? '+' : '') + formatETB(tx.amount)
                const date = formatDate(tx.createdAt)

                return (
                  <TableRow key={tx.id}>
                    <TableCell className="flex items-center gap-2">
                      {isCredit ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      {type}
                    </TableCell>
                    <TableCell
                      className={isCredit ? 'text-green-600' : 'text-red-600'}
                    >
                      {formattedAmount}
                    </TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status === 'SUCCESS'
                            ? 'default'
                            : status === 'PENDING'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}