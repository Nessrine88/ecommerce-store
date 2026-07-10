'use server'

import { prisma } from '@/lib/prisma'
import { converToPlainObject } from '../utils'
import { LATEST_PRODUCT_LIMIT } from '@/app/lib/constants'

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return converToPlainObject(data)
}