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
} from "drizzle-orm";
import { PAGE_SIZE } from "../constants";
import {
  convertToPlainObject,
  formatError,
} from "../utils";
import {
  insertProductSchema,
  updateProductsSchema,
} from "../validators";
import { revalidatePath } from "next/cache";
import z from "zod";

// Get latest products
export async function getLatestProducts(
  locale: string
) {
  const latestProducts = await db
    .select({
      product: products,
      translation: productTranslations,
    })
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(
          productTranslations.productId,
          products.id
        ),
        eq(
          productTranslations.locale,
          locale
        )
      )
    )
    .orderBy(desc(products.createdAt))
    .limit(4);

  return latestProducts.map(
    ({ product, translation }) => ({
      ...product,

      name:
        translation?.name ??
        product.name,

      description:
        translation?.description ??
        product.description,

      images: product.images ?? [],

      brand: product.brand ?? "",

      price: product.price.toString(),

      rating: Number(
        product.rating ?? 0
      ),
    })
  );
}

// Get single product by slug
export async function getProductBySlug(
  slug: string,
  locale: string
) {
  const [result] = await db
    .select({
      product: products,
      translation: productTranslations,
    })
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(
          productTranslations.productId,
          products.id
        ),
        eq(
          productTranslations.locale,
          locale
        )
      )
    )
    .where(
      eq(products.slug, slug)
    )
    .limit(1);

  if (!result) {
    return null;
  }

  return {
    ...result.product,

    name:
      result.translation?.name ??
      result.product.name,

    description:
      result.translation?.description ??
      result.product.description,

    images:
      result.product.images ?? [],

    brand:
      result.product.brand ?? "",

    price:
      result.product.price.toString(),

    rating: Number(
      result.product.rating ?? 0
    ),
  };
}

// Get all products
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
  const conditions: (SQL | undefined)[] =
    [];

  // Search in translated product name
  if (query && query !== "all") {
    conditions.push(
      ilike(
        productTranslations.name,
        `%${query}%`
      )
    );
  }

  // Category filter — category is now the category's slug,
  // so we filter by joining through categories.slug
  if (
    category &&
    category !== "all"
  ) {
    conditions.push(
      eq(
        categories.slug,
        category
      )
    );
  }

  // Price filter
  if (
    price &&
    price !== "all"
  ) {
    const [
      minStr,
      maxStr,
    ] = price.split("-");

    const min = Number(minStr);
    const max = Number(maxStr);

    if (!isNaN(min)) {
      conditions.push(
        gte(
          products.price,
          min.toString()
        )
      );
    }

    if (!isNaN(max)) {
      conditions.push(
        lte(
          products.price,
          max.toString()
        )
      );
    }
  }

  // Rating filter
  if (
    rating &&
    rating !== "all"
  ) {
    const ratingNum =
      Number(rating);

    if (!isNaN(ratingNum)) {
      conditions.push(
        gte(
          products.rating,
          ratingNum.toString()
        )
      );
    }
  }

  const filters =
    conditions.length > 0
      ? and(...conditions)
      : undefined;

  // Sort
  const orderBy =
    sort === "lowest"
      ? asc(products.price)
      : sort === "highest"
        ? desc(products.price)
        : sort === "rating"
          ? desc(products.rating)
          : desc(
              products.createdAt
            );

  const [
    data,
    [{ dataCount }],
  ] = await Promise.all([
    // Products
    db
      .select({
        product: products,
        translation:
          productTranslations,
      })
      .from(products)
      .innerJoin(
        productTranslations,
        and(
          eq(
            productTranslations.productId,
            products.id
          ),
          eq(
            productTranslations.locale,
            locale
          )
        )
      )
      .leftJoin(
        categories,
        eq(
          products.categoryId,
          categories.id
        )
      )
      .where(filters)
      .orderBy(orderBy)
      .limit(limit)
      .offset(
        (page - 1) * limit
      ),

    // Count
    db
      .select({
        dataCount: count(),
      })
      .from(products)
      .innerJoin(
        productTranslations,
        and(
          eq(
            productTranslations.productId,
            products.id
          ),
          eq(
            productTranslations.locale,
            locale
          )
        )
      )
      .leftJoin(
        categories,
        eq(
          products.categoryId,
          categories.id
        )
      )
      .where(filters),
  ]);

  return {
    data: data.map(
      ({
        product,
        translation,
      }) => ({
        ...product,

        // Localized fields
        name: translation.name,

        description:
          translation.description,

        // Normalize DB values
        images:
          product.images ?? [],

        brand:
          product.brand ?? "",

        price:
          product.price.toString(),

        rating: Number(
          product.rating ?? 0
        ),
      })
    ),

    totalPages: Math.ceil(
      dataCount / limit
    ),
  };
}

// Delete product
export async function deleteProduct(
  id: string
) {
  try {
    const product =
      await db.query.products.findFirst({
        where: eq(
          products.id,
          id
        ),
      });

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    await db
      .delete(products)
      .where(
        eq(products.id, id)
      );

    return {
      success: true,
      message:
        "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message:
        formatError(error),
    };
  }
}

// Create product
export async function createProduct(
  data: z.infer<typeof insertProductSchema>
) {
  try {
    const product =
      insertProductSchema.parse(
        data
      );

    const productToInsert = {
      ...product,
      images:
        product.images ?? [],
    };

    await db
      .insert(products)
      .values(productToInsert)
      .returning();

    revalidatePath(
      "/admin/products"
    );

    return {
      success: true,
      message:
        "Product created successfully",
    };
  } catch (error) {
    console.error(
      "FULL ERROR:",
      error
    );

    if (error instanceof Error) {
      console.error(
        "ERROR NAME:",
        error.name
      );

      console.error(
        "ERROR MESSAGE:",
        error.message
      );

      console.error(
        "ERROR STACK:",
        error.stack
      );

      if ("cause" in error) {
        console.error(
          "ERROR CAUSE:",
          error.cause
        );
      }
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create product",
    };
  }
}

// Update product
export async function updateProduct(
  data: z.infer<typeof updateProductsSchema>
) {
  try {
    const product =
      updateProductsSchema.parse(
        data
      );

    const {
      id,
      ...updateData
    } = product;

    const updated = await db
      .update(products)
      .set(updateData)
      .where(
        eq(products.id, id)
      )
      .returning();

    if (updated.length === 0) {
      throw new Error(
        "Product not found or update failed"
      );
    }

    revalidatePath(
      "/admin/products"
    );

    revalidatePath(
      `/admin/products/${id}`
    );

    return {
      success: true,
      message:
        "Product updated successfully",
      data: updated[0],
    };
  } catch (error) {
    console.error(
      "updateProduct error:",
      error
    );

    return {
      success: false,
      message:
        formatError(error),
    };
  }
}

// Get single product by ID
export async function getProductById(
  productId: string
) {
  const data =
    await db.query.products.findFirst({
      where: eq(
        products.id,
        productId
      ),
    });

  return convertToPlainObject(
    data
  );
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
        eq(
          categoryTranslations.categoryId,
          categories.id
        ),
        eq(
          categoryTranslations.locale,
          locale
        )
      )
    )
    .leftJoin(
      products,
      eq(
        products.categoryId,
        categories.id
      )
    )
    .groupBy(
      categories.id,
      categories.slug,
      categoryTranslations.name
    );
}
// Get featured products
export async function getFeaturedProducts(
  locale: string
) {
  const data = await db
    .select({
      product: products,
      translation:
        productTranslations,
    })
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(
          productTranslations.productId,
          products.id
        ),
        eq(
          productTranslations.locale,
          locale
        )
      )
    )
    .where(
      eq(
        products.isFeatured,
        true
      )
    )
    .orderBy(
      desc(products.createdAt)
    )
    .limit(4);

  return data.map(
    ({
      product,
      translation,
    }) => ({
      ...product,

      name:
        translation?.name ??
        product.name,

      description:
        translation?.description ??
        product.description,

      images:
        product.images ?? [],

      brand:
        product.brand ?? "",

      price:
        product.price.toString(),

      rating: Number(
        product.rating ?? 0
      ),
    })
  );
}