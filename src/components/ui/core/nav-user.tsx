'use client'

import { BadgeCheck, ChevronsUpDown, CreditCard, LogOut } from 'lucide-react'

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
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar
} from '@/components/ui/sidebar'
import { FallbackAvatar } from './fallback-avatar'
import { signOut } from '@/lib/auth-client'

export function NavUser({
   user
}: {
   user: {
      name: string
      email: string
      avatar: string
      guest: boolean
   }
}) {
   const { isMobile } = useSidebar()

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            {user.guest ? (
               <DropdownMenu>
                  <DropdownMenuTrigger className='w-full'>
                     <SidebarMenuButton
                        size='lg'
                        className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0'
                     >
                        <div className='flex flex-col items-center gap-1'>
                           <FallbackAvatar
                              className='border'
                              name='guest'
                              size={32}
                           />

                           <span className='text-[11px] text-muted-foreground'>
                              Guest User
                           </span>
                        </div>
                        <ChevronsUpDown className='ml-auto size-4' />
                     </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                     className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                     side={isMobile ? 'bottom' : 'right'}
                     align='end'
                     sideOffset={4}
                  >
                     <DropdownMenuSeparator />
                     <DropdownMenuGroup>
                        <DropdownMenuItem>
                           <BadgeCheck />
                           Log in
                        </DropdownMenuItem>
                     </DropdownMenuGroup>
                  </DropdownMenuContent>
               </DropdownMenu>
            ) : (
               <DropdownMenu>
                  <DropdownMenuTrigger className='w-full'>
                     <SidebarMenuButton
                        size='lg'
                        className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0'
                     >
                        <Avatar className='h-8 w-8 rounded-lg'>
                           <AvatarImage
                              src={user.avatar}
                              alt={user.name}
                           />
                           <AvatarFallback className='rounded-lg'>
                              {user.name.slice(0, 1)}
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
                        <ChevronsUpDown className='ml-auto size-4' />
                     </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                     className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                     side={isMobile ? 'bottom' : 'right'}
                     align='end'
                     sideOffset={4}
                  >
                     <DropdownMenuGroup>
                        <DropdownMenuLabel className='p-0 font-normal'>
                           <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                              <Avatar className='h-8 w-8 rounded-lg'>
                                 <AvatarImage
                                    src={user.avatar}
                                    alt={user.name}
                                 />
                                 <AvatarFallback className='rounded-lg'>
                                    CN
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
                     <DropdownMenuItem>
                        <LogOut />
                        Log out
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            )}
         </SidebarMenuItem>
      </SidebarMenu>
   )
}
