
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
  countDistinct,
  desc,
  eq,
  gte,
  ilike,
  lte,
  or,
  type SQL,
} from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { convertToPlainObject, formatError } from "../utils";
import {
  insertProductSchema,
  updateProductsSchema,
} from "../validators";
import { z } from "zod";
import { auth } from "@/auth";

// --------------------------------------------------
// Translation helpers
// --------------------------------------------------

type ProductLocale = "en" | "ar" | "fr";

type ProductTranslationInput = {
  productId: string;
  locale: ProductLocale;
  name: string;
  description: string;
};

type ProductTranslationFields = {
  name: string;
  description: string;
  nameAr?: string | null;
  descriptionAr?: string | null;
  nameFr?: string | null;
  descriptionFr?: string | null;
};

function buildProductTranslations(
  productId: string,
  data: ProductTranslationFields,
): ProductTranslationInput[] {
  const translations: ProductTranslationInput[] = [
    {
      productId,
      locale: "en",
      name: data.name.trim(),
      description: data.description.trim(),
    },
  ];

  const nameAr = data.nameAr?.trim();
  const descriptionAr = data.descriptionAr?.trim();

  if (nameAr && descriptionAr) {
    translations.push({
      productId,
      locale: "ar",
      name: nameAr,
      description: descriptionAr,
    });
  }

  const nameFr = data.nameFr?.trim();
  const descriptionFr = data.descriptionFr?.trim();

  if (nameFr && descriptionFr) {
    translations.push({
      productId,
      locale: "fr",
      name: nameFr,
      description: descriptionFr,
    });
  }

  return translations;
}

// --------------------------------------------------
// Get latest products
// --------------------------------------------------

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
    description:
      translation?.description ?? product.description,
    images: product.images ?? [],
    brand: product.brand ?? "",
    price: product.price.toString(),
    rating: Number(product.rating ?? 0),
  }));
}

// --------------------------------------------------
// Get single product by slug
// --------------------------------------------------

export async function getProductBySlug(
  slug: string,
  locale: string,
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
    description:
      result.translation?.description ??
      result.product.description,
    images: result.product.images ?? [],
    brand: result.product.brand ?? "",
    price: result.product.price.toString(),
    rating: Number(result.product.rating ?? 0),
  };
}

// --------------------------------------------------
// Get all products with filters, sorting and pagination
// --------------------------------------------------

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
  const conditions: SQL[] = [];

  // Search translated names and the default English name.
  if (query && query !== "all") {
    conditions.push(
      or(
        ilike(productTranslations.name, `%${query}%`),
        ilike(products.name, `%${query}%`),
      )!,
    );
  }

  // Filter by category slug.
  if (category && category !== "all") {
    conditions.push(eq(categories.slug, category));
  }

  // Filter by price range, e.g. "10-100".
  if (price && price !== "all") {
    const [minStr, maxStr] = price.split("-");
    const min = Number(minStr);
    const max = Number(maxStr);

    if (minStr !== "" && Number.isFinite(min)) {
      conditions.push(
        gte(products.price, min.toString()),
      );
    }

    if (maxStr !== "" && Number.isFinite(max)) {
      conditions.push(
        lte(products.price, max.toString()),
      );
    }
  }

  // Filter by minimum rating.
  if (rating && rating !== "all") {
    const ratingNum = Number(rating);

    if (Number.isFinite(ratingNum)) {
      conditions.push(
        gte(products.rating, ratingNum.toString()),
      );
    }
  }

  const filters =
    conditions.length > 0 ? and(...conditions) : undefined;

  // Sorting.
  const orderBy =
    sort === "lowest"
      ? asc(products.price)
      : sort === "highest"
        ? desc(products.price)
        : sort === "rating"
          ? desc(products.rating)
          : desc(products.createdAt);

  // Fetch products and count matching products.
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
      .leftJoin(
        categories,
        eq(products.categoryId, categories.id),
      )
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
      .leftJoin(
        categories,
        eq(products.categoryId, categories.id),
      )
      .where(filters),
  ]);

  const dataCount = Number(countResult[0]?.dataCount ?? 0);

  return {
    data: data.map(({ product, translation }) => ({
      ...product,
      name: translation?.name ?? product.name,
      description:
        translation?.description ?? product.description,
      images: product.images ?? [],
      brand: product.brand ?? "",
      price: product.price.toString(),
      rating: Number(product.rating ?? 0),
    })),
    totalPages: Math.ceil(dataCount / limit),
  };
}

// --------------------------------------------------
// Delete product
// --------------------------------------------------

export async function deleteProduct(id: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await db.delete(products).where(eq(products.id, id));

    revalidatePath("/admin/products");

    for (const locale of ["en", "fr", "ar"]) {
      revalidatePath(
        `/${locale}/product/${product.slug}`,
      );
    }

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("deleteProduct error:", error);

    return {
      success: false,
      message: formatError(error),
    };
  }
}

// --------------------------------------------------
// Create product
// --------------------------------------------------

export async function createProduct(
  data: z.infer<typeof insertProductSchema>,
) {
  try {
    // 1. Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("You must be signed in to create a product.");
    }

    // 2. Validate the submitted data
    const validatedData = insertProductSchema.parse(data);

    // 3. Separate product fields from translation fields
    const {
      nameAr,
      descriptionAr,
      nameFr,
      descriptionFr,
      ...productData
    } = validatedData;

    // 4. Create the product and its translations atomically
    const newProduct = await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({
          ...productData,
          userId,
          images: productData.images ?? [],
        })
        .returning();

      if (!product) {
        throw new Error("Failed to create the product.");
      }

      const translations = buildProductTranslations(product.id, {
        name: product.name,
        description: product.description,
        nameAr,
        descriptionAr,
        nameFr,
        descriptionFr,
      });

      await tx.insert(productTranslations).values(translations);

      return product;
    });

    // 5. Refresh the relevant pages
    revalidatePath("/admin/products");
    revalidatePath("/sell/products");

    for (const locale of ["en", "fr", "ar"]) {
      revalidatePath(`/${locale}/user/my-products`);
      revalidatePath(`/${locale}/product/${newProduct.slug}`);
    }

    // 6. Admins go back to the admin list, regular users to their own page
    const isAdmin = session?.user?.role === "admin";

    return {
      success: true,
      message: "Product created successfully.",
      productId: newProduct.id,
      redirectTo: isAdmin ? "/admin/products" : "/user/my-products",
    };
  } catch (error) {
    console.error("createProduct error:", error);

    return {
      success: false,
      message: formatError(error),
    };
  }
}
// --------------------------------------------------
// Update product
// --------------------------------------------------

export async function updateProduct(
  data: z.infer<typeof updateProductsSchema>,
) {
  try {
    const product = updateProductsSchema.parse(data);

    const {
      id,
      nameAr,
      descriptionAr,
      nameFr,
      descriptionFr,
      ...updateData
    } = product;

    const updatedProduct = await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();

      if (!updated) {
        throw new Error(
          "Product not found or update failed",
        );
      }

      const translations = buildProductTranslations(id, {
        name: updated.name,
        description: updated.description,
        nameAr,
        descriptionAr,
        nameFr,
        descriptionFr,
      });

      // Insert new translations or update existing ones.
      for (const translation of translations) {
        await tx
          .insert(productTranslations)
          .values(translation)
          .onConflictDoUpdate({
            target: [
              productTranslations.productId,
              productTranslations.locale,
            ],
            set: {
              name: translation.name,
              description: translation.description,
            },
          });
      }

      return updated;
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);

    for (const locale of ["en", "fr", "ar"]) {
      revalidatePath(
        `/${locale}/product/${updatedProduct.slug}`,
      );
    }

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

// --------------------------------------------------
// Get single product by ID
// --------------------------------------------------

export async function getProductById(productId: string) {
  const data = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  return convertToPlainObject(data);
}

// --------------------------------------------------
// Get all categories with translated names
// --------------------------------------------------

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
          categories.id,
        ),
        eq(categoryTranslations.locale, locale),
      ),
    )
    .leftJoin(
      products,
      eq(products.categoryId, categories.id),
    )
    .groupBy(
      categories.id,
      categories.slug,
      categoryTranslations.name,
    );
}

// --------------------------------------------------
// Get featured products
// --------------------------------------------------

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
    description:
      translation?.description ?? product.description,
    images: product.images ?? [],
    brand: product.brand ?? "",
    price: product.price.toString(),
    rating: Number(product.rating ?? 0),
  }));
}
