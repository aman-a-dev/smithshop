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
import { MoreHorizontal, UserPlus } from 'lucide-react'
import { getUsers } from '@/action/admin'

export default async function UsersPage() {
   const result = await getUsers()

   if (!result.success) {
      return (
         <div className="p-6 text-red-600">
            Failed to load users: {result.error}
         </div>
      )
   }

   const users = result.data!

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Users</h1>
            <Button>
               <UserPlus className="mr-2 h-4 w-4" />
               Add User
            </Button>
         </div>

         <Card>
            <CardHeader>
               <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {users.map(user => (
                        <TableRow key={user.id}>
                           <TableCell className="font-medium">
                              {user.name}
                           </TableCell>
                           <TableCell>{user.email}</TableCell>
                           <TableCell>
                              <Badge
                                 variant={
                                    user.status === 'Active'
                                       ? 'default'
                                       : user.status === 'Suspended'
                                         ? 'destructive'
                                         : 'secondary'
                                 }>
                                 {user.status}
                              </Badge>
                           </TableCell>
                           <TableCell>{user.joined}</TableCell>
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
