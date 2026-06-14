'use client'

import {
   Sidebar,
   SidebarContent,
   SidebarHeader,
   SidebarGroup,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarFooter
} from '@/components/ui/sidebar'
import {
   IconBuildingStore,
   IconShoppingCartCopy,
   IconInfoSquare,
   IconAddressBook,
   IconHeartPlus
} from '@tabler/icons-react'
import { NavUser } from '@/components/registries/nav-user'
import type { ElementType } from 'react'
import { useSession } from '@/lib/auth-client'
import { hulkFont } from '@/fonts/font'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface NavItem {
   id: string
   title: string
   icon: ElementType
   url?: string
   isActive?: boolean
}

interface SidebarData {
   navMain: NavItem[]
}

// Move data definition before component for clarity
const data: SidebarData = {
   navMain: [
      {
         id: 'products',
         title: 'Products',
         url: '/products',
         icon: IconBuildingStore
      },
      {
         id: 'carts',
         title: 'Carts',
         url: '/cart',
         icon: IconShoppingCartCopy
      },
      {
         id: 'favorites',
         title: 'Favorites',
         url: '/favourites',
         icon: IconHeartPlus
      },
      {
         id: 'contact',
         title: 'Contact',
         url: '/contact',
         icon: IconAddressBook
      },
      {
         id: 'about',
         title: 'About',
         url: '/about',
         icon: IconInfoSquare
      }
   ]
}

export default function AppSidebar({
   ...props
}: React.ComponentProps<typeof Sidebar>) {
   const { data: session } = useSession()   // ✅ real session hook

   // Determine guest status based on session existence
   const isLoggedIn = !!session?.user
   const user = {
      name: session?.user?.name ?? '',
      email: session?.user?.email,
      avatar: session?.user?.avatar,
      guest: !isLoggedIn   // ✅ true when no session
   }

   return (
      <Sidebar {...props}>
         <SidebarHeader>
            <h1
               className={cn(
                  hulkFont.className,
                  'scroll-m-20 text-center text-2xl md:text-3xl font-extrabold tracking-tight',
                  'bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent',
                  'max-w-2xl mx-auto'
               )}
            >
               Smithshop
            </h1>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
         </SidebarContent>
         <SidebarFooter>
            <NavUser user={user} />
         </SidebarFooter>
      </Sidebar>
   )
}

function NavMain({ items }: { items: NavItem[] }) {
   return (
      <SidebarGroup>
         <SidebarMenu>
            {items.map(item => {
               const Icon = item.icon
               return (
                  <Link key={item.id} href={item.url}>
                     <SidebarMenuItem>
                        <SidebarMenuButton tooltip={item.title}>
                           {Icon && <Icon className='mr-2 h-4 w-4' />}
                           <span>{item.title}</span>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  </Link>
               )
            })}
         </SidebarMenu>
      </SidebarGroup>
   )
}