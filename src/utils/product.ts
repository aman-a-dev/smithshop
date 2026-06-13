// Helper to get a human-readable title from an item
function getProductTitle(item: ProductItem, type: string): string {
   if ('amount' in item) {
      // diamonds, UC, stars, coins, etc.
      return `${item.amount} ${type.charAt(0).toUpperCase() + type.slice(1)}`
   }
   if ('level' in item) {
      return `Level ${item.level} (${item.diamonds} Diamonds)`
   }
   if ('name' in item) {
      return item.name // Weekly, Monthly, Booyah Pass, etc.
   }
   if ('duration' in item) {
      return `${item.duration} Premium`
   }
   return 'Unknown'
}

// Map a ProductItem + context to a ProductCard-friendly object
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
      image: '/images/game-placeholder.png', // use a generic or per-category placeholder
      badge: type.charAt(0).toUpperCase() + type.slice(1), // e.g. "Diamond"
      // optional: you can pass originalPrice if you ever have discounts
      currency: 'ETB'
      // originalPrice, rating etc. can be omitted
   }
}
