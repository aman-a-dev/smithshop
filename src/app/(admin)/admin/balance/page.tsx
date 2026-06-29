import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent
} from '@/components/ui/card'
import {
   Popover,
   PopoverContent,
   PopoverDescription,
   PopoverTrigger
} from '@/components/ui/popover'
import { Info, Wallet, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { getBalance } from '@/action/admin'

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
                  ${balance.toFixed(2)}
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
                     {transactions.map(tx => (
                        <TableRow key={tx.id}>
                           <TableCell className="flex items-center gap-2">
                              {tx.type === 'Deposit' ? (
                                 <ArrowUpRight className="h-4 w-4 text-green-500" />
                              ) : (
                                 <ArrowDownRight className="h-4 w-4 text-red-500" />
                              )}
                              {tx.type}
                           </TableCell>
                           <TableCell
                              className={
                                 tx.amount.startsWith('+')
                                    ? 'text-green-600'
                                    : 'text-red-600'
                              }>
                              {tx.amount}
                           </TableCell>
                           <TableCell>{tx.date}</TableCell>
                           <TableCell>
                              <span
                                 className={`px-2 py-1 rounded-full text-xs ${
                                    tx.status === 'Completed'
                                       ? 'bg-green-100 text-green-800'
                                       : tx.status === 'Pending'
                                         ? 'bg-yellow-100 text-yellow-800'
                                         : 'bg-red-100 text-red-800'
                                 }`}>
                                 {tx.status}
                              </span>
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
