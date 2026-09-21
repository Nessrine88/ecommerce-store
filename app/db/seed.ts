import "dotenv/config";

import { db } from "./index";

import {
  categories,
  categoryTranslations,
  products,
  productTranslations,
  users,
} from "./schema";

import sampleData from "./sample-data";

async function main() {
  // Delete existing data (order matters: children before parents)
  await db.delete(productTranslations);
  await db.delete(products);
  await db.delete(categoryTranslations);
  await db.delete(categories);
  await db.delete(users);

  // Insert users
  await db.insert(users).values(sampleData.users);

  // Insert categories and get their generated IDs
  const insertedCategories = await db
    .insert(categories)
    .values(sampleData.categories.map(({ slug }) => ({ slug })))
    .returning({
      id: categories.id,
      slug: categories.slug,
    });

  // Build a slug -> id lookup for products to resolve categoryId
  const categoryIdBySlug = new Map(
    insertedCategories.map((c) => [c.slug, c.id])
  );

  // Create category translations
  const categoryTranslationRows = insertedCategories.flatMap((category) => {
    const sourceCategory = sampleData.categories.find(
      (c) => c.slug === category.slug
    );

    if (!sourceCategory) {
      throw new Error(
        `Could not find category with slug: ${category.slug}`
      );
    }

    return Object.entries(sourceCategory.translations).map(
      ([locale, name]) => ({
        categoryId: category.id,
        locale,
        name,
      })
    );
  });

  await db.insert(categoryTranslations).values(categoryTranslationRows);

  // Insert products, resolving categorySlug -> categoryId
  const productsToInsert = sampleData.products.map(
    ({ categorySlug, translations, ...product }) => {
      const categoryId = categoryIdBySlug.get(categorySlug);

      if (!categoryId) {
        throw new Error(
          `Could not resolve categoryId for slug: ${categorySlug}`
        );
      }

      return {
        ...product,
        categoryId,
      };
    }
  );

  const insertedProducts = await db
    .insert(products)
    .values(productsToInsert)
    .returning({
      id: products.id,
      slug: products.slug,
    });

  // Create product translations from the translations object
  const translations = insertedProducts.flatMap((product) => {
    const sourceProduct = sampleData.products.find(
      (p) => p.slug === product.slug
    );

    if (!sourceProduct) {
      throw new Error(
        `Could not find product with slug: ${product.slug}`
      );
    }

    return Object.entries(sourceProduct.translations).map(
      ([locale, translation]) => ({
        productId: product.id,
        locale,
        name: translation.name,
        description: translation.description,
      })
    );
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