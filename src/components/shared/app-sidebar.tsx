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
   IconLayout2,
   IconInfoSquare,
   IconAddressBook,
   IconBellRinging2,
   IconHeartPlus
} from '@tabler/icons-react'
import { NavUser } from '@/components/ui/core/nav-user'
import type { ElementType } from 'react'
import { useSession } from '@/lib/auth-client'

interface NavItem {
   id: string
   title: string
   icon: ElementType
   url?: string
   isActive?: boolean
}

interface User {
   name: string
   email: string
   avatar: string
}

interface SidebarData {
   user: User
   navMain: NavItem[]
}

export default function AppSidebar({
   ...props
}: React.ComponentProps<typeof Sidebar>) {
   const { data: session } = useSession()
   const user = {
      name: 'Guest' || session?.name,
      email: '' || session?.email,
      avatar: '' || session?.image,
      guest: session ? false : true
   }
   return (
      <Sidebar {...props}>
         <SidebarHeader>
            <div>Hello</div>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
         </SidebarContent>
         <SidebarFooter user={user}>
            <NavUser />
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
                  <SidebarMenuItem key={item.id}>
                     <SidebarMenuButton tooltip={item.title}>
                        {Icon && <Icon className='mr-2 h-4 w-4' />}
                        <span>{item.title}</span>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               )
            })}
         </SidebarMenu>
      </SidebarGroup>
   )
}

const data: SidebarData = {
   navMain: [
      {
         id: 'overview',
         title: 'Overview',
         url: '/',
         icon: IconLayout2,
         isActive: true
      },
      {
         id: 'products',
         title: 'Products',
         url: '/products',
         icon: IconBuildingStore
      },
      {
         id: 'carts',
         title: 'Carts',
         url: '/carts',
         icon: IconShoppingCartCopy
      },
      {
         id: 'favorites',
         title: 'Favorites',
         url: '/favorites',
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
         url: 'about',
         icon: IconInfoSquare
      },
      {
         id: 'notifications',
         title: 'Notifications',
         url: '#',
         icon: IconBellRinging2
      }
   ]
}
