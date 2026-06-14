'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface ReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  productTitle: string
}

const reportReasons = [
  'Wrong price',
  'Out of stock',
  'Inappropriate content',
  'Broken image',
  'Other',
]

export function ReportModal({
  open,
  onOpenChange,
  productId,
  productTitle,
}: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason) {
      toast.error('Please select a reason')
      return
    }
    setIsSubmitting(true)
    // Simulate API call – replace with real endpoint
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('Report submitted:', { productId, productTitle, reason, comment })
    toast.success('Thank you for your report')
    setIsSubmitting(false)
    onOpenChange(false)
    setReason('')
    setComment('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Report product</DialogTitle>
          <DialogDescription>
            Let us know what's wrong with "{productTitle}"
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-2'>
          <div className='grid gap-2'>
            <Label htmlFor='reason'>Reason *</Label>
            <Select value={reason} onValueChange={(value) => setReason(value ?? '')}>
              <SelectTrigger id='reason'>
                <SelectValue placeholder='Select a reason' />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map(r => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='comment'>Additional comments (optional)</Label>
            <Textarea
              id='comment'
              placeholder='Please provide more details...'
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}