'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuCheckboxItem,
   DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
// import { useDebounce } from '@/hooks/use-debounce'
// import { useSearchParams } from 'next/navigation'

export default function SearchBar() {
  // const searchParams = useSearchParams()
  // const search = searchParams.get('search')

   return (
      <div>
         <Input />
         <DropdownMenu>
            <DropdownMenuTrigger
               render={<Button>Filter</Button>}
            ></DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuItem>Catagorys</DropdownMenuItem>
               <DropdownMenuCheckboxItem />
               <DropdownMenuCheckboxItem />
               <DropdownMenuCheckboxItem />
               <DropdownMenuCheckboxItem />
               <DropdownMenuSeparator />
               <DropdownMenuItem>Prices</DropdownMenuItem>
               <DropdownMenuCheckboxItem />
               <DropdownMenuCheckboxItem />
               <DropdownMenuCheckboxItem />
               <DropdownMenuCheckboxItem />
               <DropdownMenuSeparator />
               <DropdownMenuItem>Type</DropdownMenuItem>
               <DropdownMenuCheckboxItem />
               <DropdownMenuCheckboxItem />
               <DropdownMenuCheckboxItem />
               <DropdownMenuCheckboxItem />
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   )
}
