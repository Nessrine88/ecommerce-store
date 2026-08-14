

import { db } from '@/app/db'
import { products } from '@/app/db/schema'
import { and, count, eq, ilike,desc } from "drizzle-orm";
import { PAGE_SIZE } from '../constants'

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
}: {
  query?: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const filters = and(
    query ? ilike(products.name, `%${query}%`) : undefined,
    category ? eq(products.category, category) : undefined
  );

  const [data, [{ dataCount }]] = await Promise.all([
    db.query.products.findMany({
      where: filters,
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