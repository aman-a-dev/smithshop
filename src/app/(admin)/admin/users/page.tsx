import { getUsers } from '@/action/admin'
import { UserTable } from './user-table'

export default async function UsersPage() {
  const result = await getUsers({ limit: 100 })

  if (!result.success) {
    return <div className="p-6 text-red-600">Failed to load users: {result.error}</div>
  }

  return <UserTable initialUsers={result.data.users} total={result.data.total} />
}
