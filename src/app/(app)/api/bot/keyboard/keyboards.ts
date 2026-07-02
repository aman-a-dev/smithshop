import { InlineKeyboard } from 'grammy'

export function getMainKeyboard() {
  return new InlineKeyboard()
    .text('🛍️ Products', 'products')
    .text('📦 Orders', 'orders')
    .row()
    .text('🏷️ Categories', 'categories')
    .text('🛒 Cart', 'cart')
    .row()
    .text('🆘️ Help', 'help')
}

export function getCategoryKeyboard(categories: { id: string; name: string }[]) {
  const keyboard = new InlineKeyboard()
  categories.forEach((cat, i) => {
    keyboard.text(cat.name, `cat_${cat.id}`)
    if ((i + 1) % 2 === 0) keyboard.row()
  })
  return keyboard
}

export function getProductKeyboard(products: { id: string; name: string; type: string }[]) {
  const keyboard = new InlineKeyboard()
  products.forEach((p, i) => {
    keyboard.text(`${p.name} (${p.type})`, `prod_${p.id}`)
    if ((i + 1) % 2 === 0) keyboard.row()
  })
  keyboard.row().text('🔙 Back', 'back_to_categories')
  return keyboard
}

export function getPackageKeyboard(packages: { id: string; label: string; price: number }[]) {
  const keyboard = new InlineKeyboard()
  packages.forEach((pkg, i) => {
    const price = (pkg.price / 100).toFixed(2)
    keyboard.text(`${pkg.label} - ${price} ETB`, `pkg_${pkg.id}`)
    if ((i + 1) % 2 === 0) keyboard.row()
  })
  return keyboard
}

export function getPackageActionKeyboard(packageId: string) {
  return new InlineKeyboard()
    .text('🛒 Add to Cart', `addcart_${packageId}`)
    .text('💳 Buy Now', `buynow_${packageId}`)
    .row()
    .text('🔙 Back', 'back_to_products')
    .text('❌ Cancel', 'cancel_order')
}

export function getCartKeyboard(
  items: Array<{ id: string; packageLabel: string; quantity: number; unitPrice: number }>
) {
  const keyboard = new InlineKeyboard()
  items.forEach((item) => {
    const label = `${item.packageLabel} x${item.quantity} – ${(item.unitPrice * item.quantity / 100).toFixed(2)} ETB`
    keyboard.text(`❌ ${label}`, `removecart_${item.id}`).row()
  })
  keyboard
    .text('🗑️ Clear Cart', 'clear_cart')
    .text('💳 Checkout', 'checkout_cart')
    .row()
    .text('🔙 Back to Menu', 'back_to_menu')
  return keyboard
}

export function getOrderConfirmationKeyboard() {
  return new InlineKeyboard()
    .text('✅ Confirm Order', 'confirm_order')
    .text('❌ Cancel', 'cancel_order')
}