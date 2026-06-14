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
   IconBellRinging2,
   IconHeartPlus
} from '@tabler/icons-react'
import { NavUser } from '@/components/registries/nav-user'
import type { ElementType } from 'react'
import { useSession } from '@/lib/auth-client'
import { hulkFont } from '@/fonts/font'
import { cn } from '@/lib/utils'

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

export default function AppSidebar({
   ...props
}: React.ComponentProps<typeof Sidebar>) {
   //const { data: session } = useSession()
   const session = {
      user: {
         name: 'Amanuel Antenh',
         email: 'amanuelantenha@gmail.com',
         avatar: '/'
      }
   }
   const user = {
      name: session?.user?.name,
      email: session?.user?.email,
      avatar: session?.user?.avatar,
      guest: true || (session ? false : true)
   }
   return (
      <Sidebar {...props}>
         <SidebarHeader>
            <h1
               className={cn(
                  hulkFont.className,
                  'scroll-m-20 text-center text-2xl md:text-5xl lg:text-6xl font-extrabold tracking-tight',
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
            <NavUser user={session.user} />
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
