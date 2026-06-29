import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import AppSidebar from '@/components/shared/app-sidebar'
import ToggleTheme from '@/components/shared/toggle-theme'
import Footer from '@/components/shared/footer'
import { FavoritesProvider } from '@/providers/favourites-context'
import { CartProvider } from '@/providers/cart-context'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <FavoritesProvider>
        <CartProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header
                className={`
                  fixed inset-x-2 top-2 z-50 mx-auto
                  flex h-16 shrink-0 items-center gap-2
                  overflow-hidden rounded-[32px] border border-border
                  bg-background/95 shadow-2xl backdrop-blur-lg
                  transition-[width,height,left] ease-linear duration-200
                  group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
                  w-[95%]

                  md:inset-x-4 md:top-4 md:w-[90%]

                  lg:inset-x-0 lg:top-0 lg:rounded-none lg:mx-0 lg:shadow-sm
                  lg:left-[var(--sidebar-width)]
                  lg:w-[calc(100%-var(--sidebar-width))]
                  group-has-data-[collapsible=icon]/sidebar-wrapper:lg:left-[var(--sidebar-width-icon)]
                  group-has-data-[collapsible=icon]/sidebar-wrapper:lg:w-[calc(100%-var(--sidebar-width-icon))]
                  lg:pr-4
                `}
              >
                {/* Left container – only visible on mobile */}
                <div className='flex items-center gap-2 px-4 sm:block lg:hidden'>
                  <SidebarTrigger className='sm:hidden' />
                </div>

                {/* Right container – always visible, pushed to the right */}
                <div className='flex items-center gap-2 px-4 ml-auto'>
                  <ToggleTheme
                    duration={600}
                    animationType='diag-down-right'
                  />
                </div>
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
          <Footer />
        </CartProvider>
      </FavoritesProvider>
    </main>
  )
}
