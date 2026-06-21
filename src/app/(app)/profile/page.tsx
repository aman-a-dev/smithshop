'use client'

import { useEffect, useRef, useState } from 'react'
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
   const userEdited = useRef(false)

   // Redirect if not authenticated
   useEffect(() => {
      if (!isPending && !session?.user) {
         router.replace('/auth')
      }
   }, [session, isPending, router])

   // Populate name from session when it loads, but only if user hasn't edited
   useEffect(() => {
      if (session?.user?.name && !userEdited.current) {
         setName(session.user.name)
      }
   }, [session])

   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value)
      userEdited.current = true
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!session?.user) return
      const trimmedName = name.trim()
      if (trimmedName === session.user.name) {
         toast.info('No changes to save')
         return
      }
      if (!trimmedName) {
         toast.error('Name cannot be empty')
         return
      }

      setIsSubmitting(true)
      try {
         const res = await fetch('/api/user/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: trimmedName })
         })
         if (!res.ok) throw new Error('Update failed')
         await refetch()
         toast.success('Profile updated')
         userEdited.current = false
         // session will update and effect will set name to new value
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
         <div className="container mt-30 py-10 flex justify-center">
            <Card className="w-full max-w-md">
               <CardHeader>
                  <Skeleton className="h-8 w-full" />
               </CardHeader>
               <CardContent className="space-y-4">
                  <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
               </CardContent>
            </Card>
         </div>
      )
   }

   // After redirect, don't render form
   if (!session?.user) return null

   const isDirty = name.trim() !== session.user.name?.trim()

   return (
      <div className="container mt-30 py-8 px-4 max-w-2xl mx-auto">
         <Card>
            <CardHeader className="text-center">
               <div className="flex items-center justify-center w-full">
                  <AppleHelloEffectEnglish className="text-primary text-center" />
               </div>
               <div className="flex items-center gap-2 my-4">
                  <FallbackAvatar
                     name={session.user.name}
                     size={96}
                     animated
                     className="ring-4 ring-primary/20"
                  />
                  <div>
                     <CardTitle className="text-2xl">
                        {session.user.name}
                     </CardTitle>
                     <CardDescription className="text-muted-foreground">
                        {session.user.email}
                     </CardDescription>
                  </div>
               </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
               <CardContent className="space-y-4 mb-4">
                  <div className="space-y-2">
                     <label htmlFor="name" className="text-sm font-medium">
                        Display name
                     </label>
                     <Input
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Your name"
                        disabled={isSubmitting}
                     />
                     <p className="text-xs text-muted-foreground">
                        Your email is <strong>{session.user.email}</strong> and
                        cannot be changed here.
                     </p>
                  </div>
               </CardContent>
               <CardFooter className="flex justify-end gap-4">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => {
                        setName(session.user.name)
                        userEdited.current = false
                     }}
                     disabled={isSubmitting}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
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