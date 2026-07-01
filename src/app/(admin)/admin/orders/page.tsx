import { getOrders } from '@/action/admin'
import { OrderTable } from './order-table'

export default async function OrdersPage() {
  const result = await getOrders()

  if (!result.success) {
    return <div className="p-6 text-red-600">Failed to load orders: {result.error}</div>
  }

  return <OrderTable initialOrders={result.data} />
}
