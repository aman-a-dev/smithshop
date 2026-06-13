import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger
} from '@/components/ui/sidebar'
import AppSidebar from '@/components/shared/app-sidebar'
import Footer from '@/components/shared/footer'
import ThemeToggle from '@/components/shared/theme-toggler'

export default function AppLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
               <header
                  className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/95 backdrop-blur-lg border border-border shadow-2xl rounded-[32px] z-50 overflow-hidden fixed top-2 inset-x-2 mx-auto w-[95%] max-w-7xl
'
               >
                  <div className='flex items-center gap-2 px-4'>
                     <SidebarTrigger className='sm:hidden' />
                  </div>
                  <ThemeToggle />
               </header>
               {children}
            </SidebarInset>
         </SidebarProvider>
         <Footer />
      </>
   )
}
