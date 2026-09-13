
import "dotenv/config";

import { db } from "./index";

import {
  products,
  productTranslations,
  users,
} from "./schema";

import sampleData from "./sample-data";

async function main() {
  // Delete existing data
  await db.delete(productTranslations);
  await db.delete(products);
  await db.delete(users);

  // Insert users
  await db.insert(users).values(sampleData.users);

  // Insert products and get their generated IDs
  const insertedProducts = await db
    .insert(products)
    .values(sampleData.products)
    .returning({
      id: products.id,
      slug: products.slug,
    });

  // Create translations using the generated product IDs
  const translations = insertedProducts.flatMap((product) => {
    const sourceProduct = sampleData.products.find(
      (p) => p.slug === product.slug
    );

    if (!sourceProduct) {
      throw new Error(
        `Could not find product with slug: ${product.slug}`
      );
    }

    return [
      {
        productId: product.id,
        locale: "en",
        name: sourceProduct.name,
        description: sourceProduct.description,
      },
      {
        productId: product.id,
        locale: "fr",
        name: sourceProduct.name,
        description: sourceProduct.description,
      },
      {
        productId: product.id,
        locale: "ar",
        name: sourceProduct.name,
        description: sourceProduct.description,
      },
    ];
  });

  // Insert translations
  await db.insert(productTranslations).values(translations);

  console.log("✅ Seed completed successfully");

  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Seed failed:");
  console.error(error);

  process.exit(1);
});

