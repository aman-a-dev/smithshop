'use client'

import {
   LogIn,
   BadgeCheck,
   ChevronsUpDown,
   CreditCard,
   LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
   SidebarMenu,
   SidebarMenuItem,
   useSidebar
} from '@/components/ui/sidebar'

import { FallbackAvatar } from './fallback-avatar'
import { authClient } from "@/lib/auth-client"

export function NavUser({
   user
}: {
   user: {
      name: string
      email: string | undefined
      avatar: string | undefined
      guest?: boolean
   }
}) {
   const { isMobile } = useSidebar()
   const isGuest = user.guest === true // ✅ correctly evaluate guest status

   // Styling to match SidebarMenuButton (size="lg")
   const triggerClasses = cn(
      'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm',
      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      'data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
      'h-12'
   )

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger className={triggerClasses}>
                  {isGuest ? (
                     <>
                        <FallbackAvatar
                           name='guest'
                           size={32}
                        />
                        <span className='text-[11px] text-muted-foreground'>
                           Guest User
                        </span>
                        <ChevronsUpDown className='ml-auto size-4' />
                     </>
                  ) : (
                     <>
                        <FallbackAvatar
                           className='border'
                           name={user.name}
                           size={32}
                        />
                        <span className='text-[11px] text-muted-foreground'>
                           {user.email}
                        </span>
                        <ChevronsUpDown className='ml-auto size-4' />
                     </>
                  )}
               </DropdownMenuTrigger>

               <DropdownMenuContent
                  className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                  side={isMobile ? 'bottom' : 'right'}
                  align='end'
                  sideOffset={4}
               >
                  {isGuest ? (
                     <DropdownMenuGroup>
                        <DropdownMenuItem>
                           <Link
                              href='/auth'
                              className='flex w-full items-center'
                           >
                              <LogIn />
                              Log in
                           </Link>
                        </DropdownMenuItem>
                     </DropdownMenuGroup>
                  ) : (
                     <>
                        <DropdownMenuGroup>
                           <DropdownMenuLabel className='p-0 font-normal'>
                              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                 <Avatar className='h-8 w-8 rounded-lg'>
                                    <AvatarImage
                                       src={user.avatar}
                                       alt={user.name}
                                    />
                                    <AvatarFallback className='rounded-lg'>
                                       {user.name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-medium'>
                                       {user.name}
                                    </span>
                                    <span className='truncate text-xs'>
                                       {user.email}
                                    </span>
                                 </div>
                              </div>
                           </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                           <DropdownMenuItem>
                              <BadgeCheck />
                              Account
                           </DropdownMenuItem>
                           <DropdownMenuItem>
                              <CreditCard />
                              Billing
                           </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => authClient.signOut()}>
                           <LogOut />
                           Log out
                        </DropdownMenuItem>
                     </>
                  )}
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   )
}
