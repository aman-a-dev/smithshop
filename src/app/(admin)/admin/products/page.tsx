import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, PackagePlus } from 'lucide-react'
import { getProducts } from '@/action/admin'

export default async function ProductsPage() {
   const result = await getProducts()

   if (!result.success) {
      return (
         <div className="p-6 text-red-600">
            Failed to load products: {result.error}
         </div>
      )
   }

   const products = result.data!

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Products</h1>
            <Button>
               <PackagePlus className="mr-2 h-4 w-4" />
               Add Product
            </Button>
         </div>

         <Card>
            <CardHeader>
               <CardTitle>All Products</CardTitle>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {products.map(product => (
                        <TableRow key={product.id}>
                           <TableCell className="font-medium">
                              {product.id}
                           </TableCell>
                           <TableCell>{product.name}</TableCell>
                           <TableCell>{product.price}</TableCell>
                           <TableCell>{product.stock}</TableCell>
                           <TableCell>
                              <Badge
                                 variant={
                                    product.status === 'Active'
                                       ? 'default'
                                       : 'destructive'
                                 }>
                                 {product.status}
                              </Badge>
                           </TableCell>
                           <TableCell className="text-right">
                              <Button
                                 variant="ghost"
                                 size="sm">
                                 <MoreHorizontal className="h-4 w-4" />
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
      </div>
   )
}
