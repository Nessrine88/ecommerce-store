'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "@/lib/utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "@/lib/validators";
import { db } from "@/app/db";
import { orders, orderItems, carts,products, users  } from "@/app/db/schema";
import { count, desc, eq, sql, sum } from "drizzle-orm";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";

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

//Get user's orders

export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("User is not authorized");
  }

  const data = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id),
    orderBy: [desc(orders.createdAt)],
    limit,
    offset: (page - 1) * limit,
  });

  const [{ count: dataCount }] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.userId, session.user.id));

  return {
    data: convertToPlainObject(data),
    totalPages: Math.ceil(dataCount / limit),
  };
};

// Get sales data and order summary
type SalesDataType = {
  month: string;
  totalSales: number;
}[];

export async function getOrderSummary() {
  // Get counts
  const [productsCount] = await db.select({ count: count() }).from(products);
  const [ordersCount] = await db.select({ count: count() }).from(orders);
  const [usersCount] = await db.select({ count: count() }).from(users);

  // Calculate total sales
  const [{ totalSales }] = await db
    .select({ totalSales: sum(orders.totalPrice) })
    .from(orders);

  // Get monthly sales
  const salesDataRaw = await db.execute<{
    month: string;
    totalSales: string;
  }>(
    sql`
      SELECT 
        to_char("createdAt", 'MM/YY') AS "month",
        SUM("totalPrice") AS "totalSales"
      FROM "Order"
      GROUP BY to_char("createdAt", 'MM/YY')
      ORDER BY MIN("createdAt")
    `
  );

  const salesData: SalesDataType = salesDataRaw.rows.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  // Get latest sales
  const latestSales = await db.query.orders.findMany({
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    with: {
      user: { columns: { name: true } },
    },
    limit: 6,
  });

  return {
    products: productsCount.count,
    orders: ordersCount.count,
    users: usersCount.count,
    totalSales: totalSales ?? "0",
    salesData,
    latestSales,
  };
}

// Get all orders 
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const data = await db.query.orders.findMany({
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    limit,
    offset: (page - 1) * limit,
    with: {
      user: {
        columns: {
          name: true,
        },
      },
    },
  });

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(orders);

  return {
    data,
    totalPages: Math.ceil(Number(totalCount) / limit),
  };
}

//Delete an order

export async function deleteOrder(id: string) {
  try {
    await db
      .delete(orders)
      .where(eq(orders.id, id));

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete order",
    };
  }
}