import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Intro } from '@/components/shared/intro'

export default async function NotificationsPage() {
   const session = await auth.api.getSession({
      headers: await headers()
   })
   return (
      <main>
         <Intro
            heading='Notifications'
            paragraph='Your activities announcements and sessions'
         />
         <div>
           {new String(session)}
         </div>
      </main>
   )
}
