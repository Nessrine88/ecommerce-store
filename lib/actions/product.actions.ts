
'use server';

import { db } from '@/app/db'
import { products } from '@/app/db/schema'
import { and, asc, count, desc, eq, gte, ilike, lte, SQL, } from "drizzle-orm";
import { PAGE_SIZE } from '../constants'
import { convertToPlainObject, formatError } from '../utils';
import { insertProductSchema, updateProductsSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { id } from 'zod/v4/locales';

// Get latest products
export async function getLatestProducts() {
  const latestProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt))
    .limit(10)

  return latestProducts.map((product) => ({
    ...product,
    price: product.price.toString(),
    rating: Number(product.rating),
  }))
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)

  if (!product) return null

  return {
    ...product,
    price: product.price.toString(),
    rating: Number(product.rating),
  }
}





export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query?: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  const conditions: (SQL | undefined)[] = [];

  // Query filter (case-insensitive search on name)
  if (query && query !== "all") {
    conditions.push(ilike(products.name, `%${query}%`));
  }

  // Category filter
  if (category && category !== "all") {
    conditions.push(eq(products.category, category));
  }

  // Price filter (expects "min-max", e.g. "10-50")
  if (price && price !== "all") {
    const [minStr, maxStr] = price.split("-");
    const min = Number(minStr);
    const max = Number(maxStr);

    if (!isNaN(min)) {
      conditions.push(gte(products.price, min.toString()));
    }
    if (!isNaN(max)) {
      conditions.push(lte(products.price, max.toString()));
    }
  }

  // Rating filter
  if (rating && rating !== "all") {
    const ratingNum = Number(rating);
    if (!isNaN(ratingNum)) {
      conditions.push(gte(products.rating, ratingNum.toString()));
    }
  }

  const filters = conditions.length > 0 ? and(...conditions) : undefined;

  // Sort order
  const orderBy =
    sort === "lowest"
      ? asc(products.price)
      : sort === "highest"
      ? desc(products.price)
      : sort === "rating"
      ? desc(products.rating)
      : sort === "newest"
      ? desc(products.createdAt)
      : desc(products.createdAt); // default sort

  const [data, [{ dataCount }]] = await Promise.all([
    db.query.products.findMany({
      where: filters,
      orderBy,
      limit,
      offset: (page - 1) * limit,
    }),

    db
      .select({ dataCount: count() })
      .from(products)
      .where(filters),
  ]);

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
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

//Create a prodcut

export async function createProduct(
  data: z.infer<typeof insertProductSchema>
) {
  
  try {
    const product = insertProductSchema.parse(data);
    const productToInsert = {
      ...product,
      images: product.images ?? [],
    };
    const result = await db
      .insert(products)
      .values(productToInsert)
      .returning();
    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created successfully',
    };
  } catch (error) {


    console.error('FULL ERROR:', error);

    if (error instanceof Error) {
      console.error('ERROR NAME:', error.name);
      console.error('ERROR MESSAGE:', error.message);
      console.error('ERROR STACK:', error.stack);

      if ('cause' in error) {
        console.error('ERROR CAUSE:', error.cause);
      }
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to create product',
    };
  }
}

//Update a prodcut

export async function updateProduct(data: z.infer<typeof updateProductsSchema>) {
  try {
    const product = updateProductsSchema.parse(data);
    const { id, ...updateData } = product;

    const updated = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    if (updated.length === 0) {
      throw new Error('Product not found or update failed');
    }

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);

    return {
      success: true,
      message: 'Product updated successfully',
      data: updated[0],
    };
  } catch (error) {
    console.error('updateProduct error:', error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//get single product by it's ID

export async function getProductById(productId: string) {
  const data = await db.query.products.findFirst(
   { where: eq(products.id, productId)}
  );
  return convertToPlainObject(data)
}

//Get all categories

export async function getAllCategories() {
  const data = await db
    .select({
      category: products.category,
      count: count(products.id),
    })
    .from(products)
    .groupBy(products.category);

  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await db.query.products.findMany({
    where: eq(products.isFeatured, true),
    orderBy: [desc(products.createdAt)],
    limit: 4,
  });

  return convertToPlainObject(data);
}