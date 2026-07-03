'use server';

import prisma from '@/lib/prisma';
import { initializeChapaPayment } from '@/lib/chapa';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth'; // Better‑Auth server instance

/**
 * Fetch the user's cart with full package and product details
 */
export async function getCheckoutCart(userId: string) {
  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: {
      package: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });
  return cartItems;
}

/**
 * Create order and payment, initialize Chapa, clear cart
 */
export async function createOrderAndPayment(formData: FormData) {
  // 1. Authenticate user from session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error('Unauthorized');
  const userId = session.user.id;

  // 2. Fetch cart items
  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: { package: true },
  });
  if (cartItems.length === 0) throw new Error('Cart is empty');

  // 3. Calculate total
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.package.price,
    0
  );

  // 4. Get target info from form
  const targetId = formData.get('targetId') as string | null;
  const targetNote = (formData.get('targetNote') as string) || undefined;

  // 5. Create Order and OrderItems (in a transaction)
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        status: 'PENDING',
        totalAmount,
        targetId: targetId || undefined,
        targetNote,
        items: {
          create: cartItems.map((item) => ({
            packageId: item.packageId,
            quantity: item.quantity,
            unitPrice: item.package.price,
            subtotal: item.quantity * item.package.price,
          })),
        },
      },
    });

    // 6. Create Payment record
    await tx.payment.create({
      data: {
        orderId: newOrder.id,
        userId,
        amount: totalAmount,
        status: 'INITIATED',
      },
    });

    return newOrder;
  });

  // 7. Get payment record (to get its id)
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { orderId: order.id },
  });

  // 8. Fetch user details for Chapa
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { email: true, name: true },
  });
  const [firstName, ...lastNameParts] = user.name.split(' ');
  const lastName = lastNameParts.join(' ') || '';

  // 9. Initialize Chapa payment
  const { checkoutUrl, txRef } = await initializeChapaPayment(
    payment.id,
    totalAmount,
    user.email,
    firstName,
    lastName
  );

  // 10. Update payment with Chapa data
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      checkoutUrl,
      providerRef: txRef,
      status: 'PENDING',
    },
  });

  // 11. Clear the cart
  await prisma.cart.deleteMany({ where: { userId } });

  revalidatePath('/checkout');
  return { checkoutUrl, orderId: order.id };
}