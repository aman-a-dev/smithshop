/*
  Warnings:

  - A unique constraint covering the columns `[userId,packageId]` on the table `cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "cart_userId_idx" ON "cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_userId_packageId_key" ON "cart"("userId", "packageId");
