'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "@/lib/utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "@/lib/validators";
import { db } from "@/app/db";
import { orders, orderItems, carts  } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function createOrder() {
    try {
        const session = await auth();
        if (!session) throw new Error('User is not authenticated');

        const cart = await getMyCart();
        const userId = session?.user?.id;
        if (!userId) throw new Error('User not found');

        const user = await getUserById(userId);

        if (!cart || (cart && Array.isArray(cart.items) && cart.items.length === 0)) {
            return { success: false, message: 'Your cart is empty', redirectTo: '/cart' };
        }
        if (!user.address) {
            return { success: false, message: 'No shipping address', redirectTo: '/shipping-address' };
        }
        if (!user.paymentMethod) {
            return { success: false, message: 'No payment method', redirectTo: '/payment-method' };
        }
console.log('CART PRICES DEBUG:', {
  itemsPrice: cart.itemsPrice, typeofItems: typeof cart.itemsPrice,
  shippingPrice: cart.shippingPrice, typeofShipping: typeof cart.shippingPrice,
  taxPrice: cart.taxPrice, typeofTax: typeof cart.taxPrice,
  totalPrice: cart.totalPrice, typeofTotal: typeof cart.totalPrice,
});


        // Create order object
        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        // Run insert + order items + cart cleanup as a single transaction
        const insertedOrderId = await db.transaction(async (tx) => {
            const [insertedOrder] = await tx.insert(orders).values(order).returning();

            const cartItems = Array.isArray(cart.items) ? cart.items : [];

            await tx.insert(orderItems).values(
                cartItems.map((item) => ({
                    ...item,
                    price: item.price,
                    orderId: insertedOrder.id,
                }))
            );

            // Clear the cart after order is placed
            await tx
                .update(carts)
                .set({
                    items: [],
                    itemsPrice: '0.00',
                    shippingPrice: '0.00',
                    taxPrice: '0.00',
                    totalPrice: '0.00',
                    })
                .where(eq(carts.id, cart.id));

            return insertedOrder.id;
        });

        if (!insertedOrderId) throw new Error('Order creation failed');

        return { success: true, message: 'Order created', redirectTo: `/order/${insertedOrderId}` };
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return { success: false, message: formatError(error) };
    }
}

//Get Order By Id 

export async function getOrderById(orderId: string) {
  const data = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      orderItems: true,
      user: {
        columns: {
          name: true,
          email: true,
        },
      },
    },
  });

  return convertToPlainObject(data);
}