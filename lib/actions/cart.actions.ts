'use server'
import { cookies } from "next/headers"
import { CartItem } from "@/types"
import { formatError, convertToPlainObject, round2 } from "@/app/lib/utils"
import { auth } from "@/auth"
import { db } from "@/app/db"
import { carts } from "@/app/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Calculate cart prices based on items
function calcPrice(items: CartItem[]) {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  )
  const shippingPrice = round2(itemsPrice > 50 ? 0 : 5)
  const taxPrice = round2(0.15 * itemsPrice)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value
  if (!sessionCartId) return undefined

  const session = await auth()
  const userId = session?.user?.id as string | undefined

  const cart = await db.query.carts.findFirst({
    where: userId
      ? eq(carts.userId, userId)
      : eq(carts.sessionCartId, sessionCartId),
  })

  if (!cart) return undefined

  return convertToPlainObject(cart)
}

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart session not found')

    const session = await auth()
    const userId = session?.user?.id as string | undefined

    const cart = await getMyCart()

    if (!cart) {
      // create a new cart with this item
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice([data])

      await db.insert(carts).values({
        userId,
        sessionCartId,
        items: [data],
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    } else {
      // merge item into existing cart.items and update
      const existingItems = (cart.items as CartItem[]) ?? []
      const existingItem = existingItems.find(
        (i) => i.productId === data.productId
      )

      const updatedItems = existingItem
        ? existingItems.map((i) =>
            i.productId === data.productId
              ? { ...i, qty: i.qty + data.qty }
              : i
          )
        : [...existingItems, data]

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrice(updatedItems)

      await db.update(carts)
        .set({
          items: updatedItems,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        })
        .where(eq(carts.id, cart.id))
    }

    revalidatePath(`/product/${data.slug}`)

    return {
      success: true,
      message: 'Item added to cart',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}