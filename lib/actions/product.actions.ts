'use server'

import { prisma } from '@/lib/prisma'

export async function getLatestProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return products.map((product) => ({
    ...product,
    price: product.price.toString(),
    rating: Number(product.rating),
  }));
}


// Get single product by its slug
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
    },
  });

  if (!product) return null;

  return {
    ...product,
    price: product.price.toString(),
    rating: product.rating.toString(),
  };
}