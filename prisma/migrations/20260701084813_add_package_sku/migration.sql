/*
  Warnings:

  - You are about to drop the column `costPrice` on the `package` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `package` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sku` to the `package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "package" DROP COLUMN "costPrice",
ADD COLUMN     "sku" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "package_sku_key" ON "package"("sku");
