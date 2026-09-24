"use server";

import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import type { CartItem } from "@/types";
import {
  formatError,
  convertToPlainObject,
  round2,
} from "@/lib/utils";
import { auth } from "@/auth";
import { db } from "@/app/db";
import {
  carts,
  productTranslations,
} from "@/app/db/schema";
import {
  and,
  eq,
  inArray,
} from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Calculate cart prices based on items
function calcPrice(items: CartItem[]) {
  const itemsPrice = round2(
    items.reduce(
      (acc, item) => acc + Number(item.price) * item.qty,
      0,
    ),
  );

  const shippingPrice = round2(itemsPrice > 50 ? 0 : 5);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(
    itemsPrice + shippingPrice + taxPrice,
  );

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}

// Get the raw cart from the database.
// This function does NOT translate product names.
async function getRawCart() {
  const sessionCartId = (await cookies())
    .get("sessionCartId")
    ?.value;

  if (!sessionCartId) return undefined;

  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  const cart = await db.query.carts.findFirst({
    where: userId
      ? eq(carts.userId, userId)
      : eq(carts.sessionCartId, sessionCartId),
  });

  return cart;
}

// Get the user's cart with product names translated
// according to the current locale.
export async function getMyCart() {
  try {
    const cart = await getRawCart();

    if (!cart) return undefined;

    const items = (cart.items as CartItem[]) ?? [];

    // Nothing to translate
    if (items.length === 0) {
      return convertToPlainObject(cart);
    }

    // Get current application locale
    const locale = await getLocale();

    // Get all product IDs from the cart
    const productIds = items.map(
      (item) => item.productId,
    );

    // Get translations for all products in the current locale
    const translations = await db
      .select({
        productId: productTranslations.productId,
        name: productTranslations.name,
      })
      .from(productTranslations)
      .where(
        and(
          inArray(
            productTranslations.productId,
            productIds,
          ),
          eq(
            productTranslations.locale,
            locale,
          ),
        ),
      );

    // Create a quick productId -> translated name map
    const translationMap = new Map(
      translations.map((translation) => [
        translation.productId,
        translation.name,
      ]),
    );

    // Replace the stored name with the current locale's name
    const localizedItems = items.map((item) => ({
      ...item,
      name:
        translationMap.get(item.productId) ??
        item.name,
    }));

    return convertToPlainObject({
      ...cart,
      items: localizedItems,
    });
  } catch (err) {
    console.error(
      "RAW CART QUERY ERROR:",
      err,
    );

    throw err;
  }
}

export async function addItemToCart(
  data: CartItem,
) {
  try {
    const sessionCartId = (await cookies())
      .get("sessionCartId")
      ?.value;

    if (!sessionCartId) {
      throw new Error("Cart session not found");
    }

    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    // IMPORTANT:
    // Use the raw cart here so adding an item does not
    // accidentally change all stored names to the current locale.
    const cart = await getRawCart();

    if (!cart) {
      // Create a new cart with this item
      const {
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      } = calcPrice([data]);

      await db.insert(carts).values({
        userId,
        sessionCartId,
        items: [data],
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
    } else {
      // Merge item into existing cart.items and update
      const existingItems =
        (cart.items as CartItem[]) ?? [];

      const existingItem = existingItems.find(
        (item) =>
          item.productId === data.productId,
      );

      const updatedItems = existingItem
        ? existingItems.map((item) =>
            item.productId === data.productId
              ? {
                  ...item,
                  qty: item.qty + data.qty,
                }
              : item,
          )
        : [...existingItems, data];

      const {
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      } = calcPrice(updatedItems);

      await db
        .update(carts)
        .set({
          items: updatedItems,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        })
        .where(eq(carts.id, cart.id));
    }

    revalidatePath(`/product/${data.slug}`);

    return {
      success: true,
      message: "Item added to cart",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function removeItemFromCart(
  productId: string,
) {
  try {
    const sessionCartId = (await cookies())
      .get("sessionCartId")
      ?.value;

    if (!sessionCartId) {
      throw new Error("Cart session not found");
    }

    // IMPORTANT:
    // Use raw cart for mutations.
    const cart = await getRawCart();

    if (!cart) {
      throw new Error("Cart not found");
    }

    const existingItems =
      (cart.items as CartItem[]) ?? [];

    const existingItem = existingItems.find(
      (item) =>
        item.productId === productId,
    );

    if (!existingItem) {
      throw new Error("Item not found in cart");
    }

    // Decrement qty, or remove entirely if qty is 1
    const updatedItems =
      existingItem.qty === 1
        ? existingItems.filter(
            (item) =>
              item.productId !== productId,
          )
        : existingItems.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  qty: item.qty - 1,
                }
              : item,
          );

    const {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = calcPrice(updatedItems);

    await db
      .update(carts)
      .set({
        items: updatedItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
      .where(eq(carts.id, cart.id));

    revalidatePath(
      `/product/${existingItem.slug}`,
    );

    return {
      success: true,
      message: "Item removed from cart",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}