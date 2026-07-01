// prisma/seed.ts
//
// Seeds Category / Product / Package from data/products-list.ts
// Uses Prisma's generated input types (Prisma.PackageCreateManyInput etc.)
// instead of manual interfaces, so the seed stays in sync with schema.prisma.
//
// Requires: `sku String @unique` added to the Package model (see explanation)
// for idempotent re-runs.
//
// package.json:
//   "prisma": { "seed": "tsx prisma/seed.ts" }
// (or ts-node — either works, just adjust the runner)

import { productsList, ProductItem } from '@/data/products-list'; // adjust path to your file
import { Prisma } from '@/generated/prisma/client'

import prisma from '@/lib/prisma'


// ------------------------------------------------------------------
// Helpers: derive label/sku from the union type without needing
// separate manual interfaces — narrowed via `in` checks.
// ------------------------------------------------------------------

function buildLabel(type: string, item: ProductItem): string {
  if ("amount" in item) {
    const unitLabel = type === "diamond" || type === "diamonds" ? "Diamonds" : type.toUpperCase();
    return `${item.amount} ${unitLabel}`;
  }
  if ("level" in item) return `Level ${item.level}`;
  if ("name" in item) return item.name;
  if ("duration" in item) return item.duration;
  return "Package";
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, "-");
}

function buildSku(categorySlug: string, type: string, item: ProductItem): string {
  const parts = [categorySlug, type];
  if ("amount" in item) parts.push(String(item.amount));
  if ("level" in item) parts.push(`lvl${item.level}`);
  if ("name" in item) parts.push(slugify(item.name));
  if ("duration" in item) parts.push(slugify(item.duration));
  return parts.join("-");
}

function toPackageInput(
  productId: string,
  categorySlug: string,
  type: string,
  item: ProductItem
): Prisma.PackageCreateManyInput {
  const base: Prisma.PackageCreateManyInput = {
    productId,
    label: buildLabel(type, item),
    price: item.price,
    sku: buildSku(categorySlug, type, item),
  };

  if ("amount" in item) base.amount = item.amount;
  if ("level" in item) {
    base.level = item.level;
    base.diamonds = item.diamonds;
  }
  if ("name" in item) base.membershipName = item.name;
  if ("duration" in item) base.duration = item.duration;

  return base;
}

// ------------------------------------------------------------------
// Main seed
// ------------------------------------------------------------------

async function main() {
  for (const cat of productsList.categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { slug: cat.slug, name: cat.name },
    });

    for (const group of cat.products) {
      const productName = `${cat.name} ${group.type.charAt(0).toUpperCase()}${group.type.slice(1)}`;

      const product = await prisma.product.upsert({
        where: { categoryId_type: { categoryId: category.id, type: group.type } },
        update: { name: productName },
        create: {
          categoryId: category.id,
          type: group.type,
          name: productName,
        },
      });

      const packagesData = group.items.map((item) =>
        toPackageInput(product.id, cat.slug, group.type, item)
      );

      // Upsert each package individually (createMany can't upsert).
      // Sequential is fine for a seed script; wrap in a transaction
      // per-category if you want all-or-nothing semantics.
      for (const pkg of packagesData) {
        await prisma.package.upsert({
          where: { sku: pkg.sku! },
          update: { ...pkg },
          create: { ...pkg },
        });
      }

      console.log(`✔ ${productName}: ${packagesData.length} packages`);
    }
  }
}

main()
  .then(async () => {
    console.log("\nSeed complete.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
