import { FazerCardsClient } from 'fazercards'

export const fz = new FazerCardsClient({
  apiKey: process.env.FAZER_API_KEY!
})

export async function placeFazerOrder(
  sku: string,
  targetId: string,
  quantity: number = 1
): Promise<{ orderId: string; ref: string }> {
  const response = await fz.orders.create({
    sku_id: sku,
    quantity,
    // Player/target id for game top-ups goes in metadata — confirm the
    // exact key FazerCards expects for this SKU's category in their catalog.
    metadata: { target_id: targetId },
    idempotencyKey: 'auto',
  })
  return {
    orderId: response.id,
    // OrderResource has no `reference` field — id is the canonical
    // identifier, code/codes are only populated for code-based SKUs.
    ref: response.code ?? response.id,
  }
}