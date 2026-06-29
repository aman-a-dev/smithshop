import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
   return (
      <div className='flex flex-col gap-2 items-center justify-center '>
         {Array.from({ length: 10 }).map((_, index) => (
            <div key={index}>
               <Skeleton className='h-40 w-[95%]' />
            </div>
         ))}
      </div>
   )
}
