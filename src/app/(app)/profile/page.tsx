'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { FallbackAvatar } from '@/components/registries/fallback-avatar'
import { AppleHelloEffectEnglish } from '@/components/registries/apple-hello-effect'

export default function ProfilePage() {
   const router = useRouter()
   const { data: session, isPending, refetch } = useSession()
   const [name, setName] = useState('')
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [isDirty, setIsDirty] = useState(false)

   // Redirect if not authenticated
   useEffect(() => {
      if (!isPending && !session?.user) {
         router.replace('/auth')
      }
   }, [session, isPending, router])

   // Populate name when session loads
   useEffect(() => {
      if (session?.user?.name) {
         setName(session.user.name)
         setIsDirty(false)
      }
   }, [session])

   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value)
      setIsDirty(e.target.value !== session?.user?.name)
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!session?.user) return
      if (!isDirty) {
         toast.info('No changes to save')
         return
      }
      if (!name.trim()) {
         toast.error('Name cannot be empty')
         return
      }

      setIsSubmitting(true)
      try {
         const res = await fetch('/api/user/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.trim() })
         })
         if (!res.ok) throw new Error('Update failed')
         await refetch() // refresh session
         toast.success('Profile updated')
         setIsDirty(false)
      } catch (error) {
         toast.error('Something went wrong')
         console.error(error)
      } finally {
         setIsSubmitting(false)
      }
   }

   // Loading state
   if (isPending) {
      return (
         <div className='container mx-auto py-10 flex justify-center'>
            <Card className='w-full max-w-md'>
               <CardHeader>
                  <Skeleton className='h-8 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
               </CardHeader>
               <CardContent className='space-y-4'>
                  <Skeleton className='h-20 w-20 rounded-full mx-auto' />
                  <Skeleton className='h-10 w-full' />
                  <Skeleton className='h-10 w-full' />
               </CardContent>
            </Card>
         </div>
      )
   }

   // After redirect, don't render form
   if (!session?.user) return null

   return (
      <div className='container mx-auto py-8 px-4 max-w-2xl'>
         <div className='flex justify-center mb-8'>
            <AppleHelloEffectEnglish className='text-primary' />
         </div>

         <Card>
            <CardHeader className='text-center'>
               <div className='flex justify-center mb-4'>
                  <FallbackAvatar
                     name={session.user.name}
                     size={96}
                     animated
                     className='ring-4 ring-primary/20'
                  />
               </div>
               <CardTitle className='text-2xl'>Your Profile</CardTitle>
               <CardDescription>Update your display name</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
               <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                     <label
                        htmlFor='name'
                        className='text-sm font-medium'
                     >
                        Display name
                     </label>
                     <Input
                        id='name'
                        value={name}
                        onChange={handleNameChange}
                        placeholder='Your name'
                        disabled={isSubmitting}
                     />
                     <p className='text-xs text-muted-foreground'>
                        Your email is <strong>{session.user.email}</strong> and
                        cannot be changed here.
                     </p>
                  </div>
               </CardContent>
               <CardFooter className='flex justify-end gap-4'>
                  <Button
                     type='button'
                     variant='outline'
                     onClick={() => {
                        setName(session.user.name)
                        setIsDirty(false)
                     }}
                     disabled={isSubmitting}
                  >
                     Cancel
                  </Button>
                  <Button
                     type='submit'
                     disabled={isSubmitting || !isDirty}
                  >
                     {isSubmitting ? 'Saving...' : 'Save changes'}
                  </Button>
               </CardFooter>
            </form>
         </Card>
      </div>
   )
}
