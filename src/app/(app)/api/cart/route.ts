import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

type CartItem = {
  id: string;
  packageId: string;
  title: string;
  price: number;
  image: string;
  currency: string;
  quantity: number;
  subtitle?: string;
  type?: string;
};

async function getUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.id ?? null;
}

function mapRow(row: any): CartItem {
  return {
    id: row.packageId,
    packageId: row.packageId,
    title: row.package?.label ?? "Package",
    price: row.package?.price ?? 0,
    image: "/placeholder.png",
    currency: "ETB",
    quantity: row.quantity,
    subtitle: row.package?.product?.name ?? row.package?.product?.type ?? "",
    type: row.package?.product?.type ?? "",
  };
}

async function listCart(userId: string) {
  const rows = await prisma.cart.findMany({
    where: { userId },
    include: {
      package: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map(mapRow);
}

async function upsertCartItem(userId: string, packageId: string, quantity: number) {
  const existing = await prisma.cart.findFirst({
    where: { userId, packageId },
  });

  if (existing) {
    await prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cart.create({
      data: {
        userId,
        packageId,
        quantity,
      },
    });
  }

  return listCart(userId);
}

async function setCartQuantity(userId: string, packageId: string, quantity: number) {
  const existing = await prisma.cart.findFirst({
    where: { userId, packageId },
  });

  if (!existing) return listCart(userId);

  if (quantity <= 0) {
    await prisma.cart.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.cart.update({
      where: { id: existing.id },
      data: { quantity },
    });
  }

  return listCart(userId);
}

async function removeCartItem(userId: string, packageId: string) {
  const existing = await prisma.cart.findFirst({
    where: { userId, packageId },
  });

  if (existing) {
    await prisma.cart.delete({
      where: { id: existing.id },
    });
  }

  return listCart(userId);
}

async function clearUserCart(userId: string) {
  await prisma.cart.deleteMany({
    where: { userId },
  });

  return [];
}

async function mergeGuestCart(userId: string, items: CartItem[]) {
  for (const item of items) {
    const qty = Math.max(1, item.quantity || 1);
    const existing = await prisma.cart.findFirst({
      where: { userId, packageId: item.packageId },
    });

    if (existing) {
      await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + qty },
      });
    } else {
      await prisma.cart.create({
        data: {
          userId,
          packageId: item.packageId,
          quantity: qty,
        },
      });
    }
  }

  return listCart(userId);
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ items: [] });
  }

  const items = await listCart(userId);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (body.action === "merge") {
    const items = Array.isArray(body.items) ? body.items : [];
    const merged = await mergeGuestCart(userId, items);
    return NextResponse.json({ items: merged });
  }

  if (body.action === "upsert") {
    const item = body.item as CartItem;
    const quantity = Math.max(1, item.quantity || 1);
    const updated = await upsertCartItem(userId, item.packageId, quantity);
    return NextResponse.json({ items: updated });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function PATCH(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const packageId = body.packageId as string;
  const quantity = Number(body.quantity ?? 1);

  if (!packageId) {
    return NextResponse.json({ error: "packageId is required" }, { status: 400 });
  }

  const items = await setCartQuantity(userId, packageId, quantity);
  return NextResponse.json({ items });
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const packageId = body?.packageId as string | undefined;

  if (!packageId) {
    const items = await clearUserCart(userId);
    return NextResponse.json({ items });
  }

  const items = await removeCartItem(userId, packageId);
  return NextResponse.json({ items });
}