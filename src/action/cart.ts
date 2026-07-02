/*
import prisma from '@/lib/prisma'

export async function getUserCart(userId: string) {
  const allCarts = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      carts: true
    }
  })
}
*/