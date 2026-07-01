import { ProductCardProps } from '@/components/registries/product-card'
import { ProductItem } from '@/data/products-list'

function getProductTitle(item: ProductItem, type: string): string {
  if ('amount' in item) {
    return `${item.amount} ${type.charAt(0).toUpperCase() + type.slice(1)}`
  }
  if ('level' in item) {
    return `Level ${item.level} (${item.diamonds} Diamonds)`
  }
  if ('name' in item) {
    return item.name
  }
  if ('duration' in item) {
    return `${item.duration} Premium`
  }
  return 'Unknown'
}

export function getImage(id: string) {
  switch (id) {
    case 'free-fire': return 'ff'
    case 'roblox': return 'rb'
    case 'call-of-duty': return 'cod'
    case 'blood-strike': return 'bs'
    case 'efootball': return 'efb'
    case 'instagram': return 'default'
    case 'tiktok': return 'default'
    case 'telegram': return 'tg'
    case 'pubg-mobile': return 'pg'
    default: return 'default'
  }
}

export function mapItemToCardProps(
  item: ProductItem,
  type: string,
  categoryId: string,
  index: number
): ProductCardProps & { id: string } {
  return {
    id: `${categoryId}-${type}-${index}`,
    title: getProductTitle(item, type),
    price: item.price,
    image: `/images/${getImage(categoryId)}.png`,
    badge: type.charAt(0).toUpperCase() + type.slice(1),
    currency: 'ETB'
  }
}