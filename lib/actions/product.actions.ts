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

//Get single produt by it's slug 
export async function getProductBySlug(slug:string){
  return await prisma.product.findFirst({
    where: {slug:slug},
  })
}