import { getProducts, getProductOptions } from '@/action/admin'
import { ProductTable } from './product-table'

export default async function ProductsPage() {
  const [productsResult, optionsResult] = await Promise.all([getProducts(), getProductOptions()])

  if (!productsResult.success) {
    return <div className="p-6 text-red-600">Failed to load products: {productsResult.error}</div>
  }

  return (
    <ProductTable
      initialPackages={productsResult.data}
      productOptions={optionsResult.success ? optionsResult.data : []}
    />
  )
}
