"use server";

import { db } from "@/app/db";
import {
  products,
  productTranslations,
  categories,
  categoryTranslations,
} from "@/app/db/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  lte,
  SQL,
  countDistinct,
} from "drizzle-orm";
import { PAGE_SIZE } from "../constants";
import { convertToPlainObject, formatError } from "../utils";
import { insertProductSchema, updateProductsSchema } from "../validators";
import { revalidatePath } from "next/cache";
import z from "zod";

// Get latest products
export async function getLatestProducts(locale: string) {
  const latestProducts = await db
    .select({
      product: products,
      translation: productTranslations,
    })
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(productTranslations.productId, products.id),
        eq(productTranslations.locale, locale),
      ),
    )
    .orderBy(desc(products.createdAt))
    .limit(6);

  return latestProducts.map(({ product, translation }) => ({
    ...product,

    name: translation?.name ?? product.name,

    description: translation?.description ?? product.description,

    images: product.images ?? [],

    brand: product.brand ?? "",

    price: product.price.toString(),

    rating: Number(product.rating ?? 0),
  }));
}

// Get single product by slug
export async function getProductBySlug(slug: string, locale: string) {
  const [result] = await db
    .select({
      product: products,
      translation: productTranslations,
    })
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(productTranslations.productId, products.id),
        eq(productTranslations.locale, locale),
      ),
    )
    .where(eq(products.slug, slug))
    .limit(1);

  if (!result) {
    return null;
  }

  return {
    ...result.product,

    name: result.translation?.name ?? result.product.name,

    description: result.translation?.description ?? result.product.description,

    images: result.product.images ?? [],

    brand: result.product.brand ?? "",

    price: result.product.price.toString(),

    rating: Number(result.product.rating ?? 0),
  };
}

export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
  locale,
}: {
  query?: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
  locale: string;
}) {
  const conditions: (SQL | undefined)[] = [];

  // Search by translated product name.
  if (query && query !== "all") {
    conditions.push(ilike(productTranslations.name, `%${query}%`));
  }

  // Filter by category.
  if (category && category !== "all") {
    conditions.push(eq(categories.slug, category));
  }

  // Filter by price range, e.g. "10-100".
  if (price && price !== "all") {
    const [minStr, maxStr] = price.split("-");
    const min = Number(minStr);
    const max = Number(maxStr);

    if (minStr !== "" && Number.isFinite(min)) {
      conditions.push(gte(products.price, min.toString()));
    }

    if (maxStr !== "" && Number.isFinite(max)) {
      conditions.push(lte(products.price, max.toString()));
    }
  }

  // Filter by minimum rating.
  if (rating && rating !== "all") {
    const ratingNum = Number(rating);

    if (Number.isFinite(ratingNum)) {
      conditions.push(gte(products.rating, ratingNum.toString()));
    }
  }

  const filters = conditions.length > 0 ? and(...conditions) : undefined;

  // Sort products.
  const orderBy =
    sort === "lowest"
      ? asc(products.price)
      : sort === "highest"
        ? desc(products.price)
        : sort === "rating"
          ? desc(products.rating)
          : desc(products.createdAt);

  // Fetch the current page and count matching products in parallel.
  const [data, countResult] = await Promise.all([
    db
      .select({
        product: products,
        translation: productTranslations,
      })
      .from(products)
      .leftJoin(
        productTranslations,
        and(
          eq(productTranslations.productId, products.id),
          eq(productTranslations.locale, locale),
        ),
      )
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(filters)
      .orderBy(orderBy)
      .limit(limit)
      .offset((page - 1) * limit),

    db
      .select({
        dataCount: countDistinct(products.id),
      })
      .from(products)
      .leftJoin(
        productTranslations,
        and(
          eq(productTranslations.productId, products.id),
          eq(productTranslations.locale, locale),
        ),
      )
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(filters),
  ]);

  const dataCount = countResult[0]?.dataCount ?? 0;

  return {
    data: data.map(({ product, translation }) => ({
      ...product,

      // Use translated values when available.
      // These empty-string fallbacks avoid returning null.
      // They do not recover a default name or description.
      name: translation?.name ?? "",
      description: translation?.description ?? "",

      images: product.images ?? [],
      brand: product.brand ?? "",
      price: product.price.toString(),
      rating: Number(product.rating ?? 0),
    })),

    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete product
export async function deleteProduct(id: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await db.delete(products).where(eq(products.id, id));

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Create product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    // 1. Validate the submitted form data
    const product = insertProductSchema.parse(data);

    // 2. Separate translations from the base product fields
    const { nameAr, descriptionAr, nameFr, descriptionFr, ...productData } =
      product;

    // 3. Insert the product and translations atomically
    await db.transaction(async (tx) => {
      const [newProduct] = await tx
        .insert(products)
        .values({
          ...productData,
          images: productData.images ?? [],
        })
        .returning();

      if (!newProduct) {
        throw new Error("Failed to create product");
      }

      // English translation
      const translations = [
        {
          productId: newProduct.id,
          locale: "en",
          name: productData.name,
          description: productData.description,
        },

        // Arabic translation, when both fields are provided
        ...(nameAr?.trim() && descriptionAr?.trim()
          ? [
              {
                productId: newProduct.id,
                locale: "ar",
                name: nameAr.trim(),
                description: descriptionAr.trim(),
              },
            ]
          : []),

        // French translation, when both fields are provided
        ...(nameFr?.trim() && descriptionFr?.trim()
          ? [
              {
                productId: newProduct.id,
                locale: "fr",
                name: nameFr.trim(),
                description: descriptionFr.trim(),
              },
            ]
          : []),
      ];

      await tx.insert(productTranslations).values(translations);
    });

    // 4. Refresh the admin products page
    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    console.error("createProduct error:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

// Update product
export async function updateProduct(
  data: z.infer<typeof updateProductsSchema>,
) {
  try {
    const product = updateProductsSchema.parse(data);

    const { id, nameAr, descriptionAr, nameFr, descriptionFr, ...updateData } =
      product;

    const updatedProduct = await db.transaction(async (tx) => {
      // 1. Update the base product
      const [updated] = await tx
        .update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();

      if (!updated) {
        throw new Error("Product not found or update failed");
      }

      // 2. Prepare translations
      const translations = [
        {
          productId: id,
          locale: "en",
          name: updateData.name,
          description: updateData.description,
        },
        ...(nameAr?.trim() && descriptionAr?.trim()
          ? [
              {
                productId: id,
                locale: "ar",
                name: nameAr.trim(),
                description: descriptionAr.trim(),
              },
            ]
          : []),
        ...(nameFr?.trim() && descriptionFr?.trim()
          ? [
              {
                productId: id,
                locale: "fr",
                name: nameFr.trim(),
                description: descriptionFr.trim(),
              },
            ]
          : []),
      ];

      // 3. Insert missing translations or update existing ones
      for (const translation of translations) {
        await tx
          .insert(productTranslations)
          .values(translation)
          .onConflictDoUpdate({
            target: [productTranslations.productId, productTranslations.locale],
            set: {
              name: translation.name,
              description: translation.description,
            },
          });
      }

      return updated;
    });

    // 4. Revalidate relevant pages
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);

    revalidatePath(`/en/product/${updatedProduct.slug}`);
    revalidatePath(`/fr/product/${updatedProduct.slug}`);
    revalidatePath(`/ar/product/${updatedProduct.slug}`);

    return {
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    };
  } catch (error) {
    console.error("updateProduct error:", error);

    return {
      success: false,
      message: formatError(error),
    };
  }
}
// Get single product by ID
export async function getProductById(productId: string) {
  const data = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  return convertToPlainObject(data);
}

// Get all categories (with translated names for the given locale)
export async function getAllCategories(locale: string) {
  return db
    .select({
      slug: categories.slug,
      name: categoryTranslations.name,
      count: count(products.id),
    })
    .from(categories)
    .leftJoin(
      categoryTranslations,
      and(
        eq(categoryTranslations.categoryId, categories.id),
        eq(categoryTranslations.locale, locale),
      ),
    )
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id, categories.slug, categoryTranslations.name);
}
// Get featured products
export async function getFeaturedProducts(locale: string) {
  const data = await db
    .select({
      product: products,
      translation: productTranslations,
    })
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(productTranslations.productId, products.id),
        eq(productTranslations.locale, locale),
      ),
    )
    .where(eq(products.isFeatured, true))
    .orderBy(desc(products.createdAt))
    .limit(6);

  return data.map(({ product, translation }) => ({
    ...product,

    name: translation?.name ?? product.name,

    description: translation?.description ?? product.description,

    images: product.images ?? [],

    brand: product.brand ?? "",

    price: product.price.toString(),

    rating: Number(product.rating ?? 0),
  }));
}
