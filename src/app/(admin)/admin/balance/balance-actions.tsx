'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Wallet, RefreshCw } from 'lucide-react'

export function BalanceActions() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleRefresh() {
    startTransition(() => router.refresh())
  }

  function handleAddFund() {
    // No addFund server action exists yet — this intentionally doesn't
    // pretend to work. Wire this to a real Transaction-creation action
    // (and ideally a Chapa/manual top-up record) before shipping.
    toast.info('Manual top-ups aren\'t wired up yet — add a Transaction record directly for now.')
  }

  return (
    <div className="flex gap-2 mt-5">
      <Button onClick={handleAddFund}>
        <Wallet className="mr-2 h-4 w-4" /> Add Fund
      </Button>
      <Button variant="secondary" onClick={handleRefresh} disabled={isPending}>
        <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`} /> Refresh
      </Button>
    </div>
  )
}
