import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger
} from '@/components/ui/sidebar'
import AdmainSidebar from '@/components/admin/admin-sidebar'
import ToggleTheme from '@/components/shared/toggle-theme'
import { Badge } from '@/components/ui/badge'
// import { auth } from '@/lib/auth'
// import { headers } from 'next/headers'

export default function AdminLayout({
   children
}: {
   children: React.ReactNode
}) {
   // const session = await auth.api.getSession({
   //     headers: headers()
   // })
   // if (session?.user?.role !== 'admin') {
   //     return <div>Access denied</div>
   // }
   return (
      <main className="my-24 mx-3">
         <SidebarProvider>
            <AdmainSidebar />
            <SidebarInset>
               <header
                  className={`
                     fixed inset-x-2 top-2 z-50 mx-auto 
                     flex h-16 shrink-0 items-center justify-between gap-2 
                     overflow-hidden rounded-[32px] border border-border 
                     bg-background/95 shadow-2xl backdrop-blur-lg 
                     transition-[width,height] ease-linear 
                     group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
                     w-[95%]
                     
                     /* Tablet (md) */
                     md:inset-x-4 md:top-4 md:w-[90%]
                     
                     /* Laptop (lg) */
                     lg:left-[18rem] lg:rounded lg:top-0
                     
                     /* Extra large (xl) – keep max-w-7xl */
                  `}>
                  <div className="flex items-center gap-2 px-4">
                     <SidebarTrigger className="sm:hidden" />
                  </div>
                  <div className="flex items-center gap-2 px-4">
                     <Badge>Admin Panel</Badge>
                     <ToggleTheme
                        duration={600}
                        animationType="diag-down-right"
                     />
                  </div>
               </header>
               {children}
            </SidebarInset>
         </SidebarProvider>
      </main>
   )
}
