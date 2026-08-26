
'use server';

import { db } from '@/app/db'
import { products } from '@/app/db/schema'
import { and, count, eq, ilike,desc } from "drizzle-orm";
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