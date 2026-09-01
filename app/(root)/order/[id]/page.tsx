import { Metadata } from "next";
import { notFound } from "next/navigation";
import Stripe from "stripe";

import OrderDetailsTable from "./order-details-table";
import { getOrderById } from "@/lib/actions/order.actions";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Order Details",
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const session = await auth();

  let clientSecret: string | null = null;

  // Create a PaymentIntent only when the order is unpaid
  // and Stripe is the selected payment method.
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "usd",

      metadata: {
        orderId: order.id,
      },
    });

    clientSecret = paymentIntent.client_secret;
  }

  const orderDetails = {
    ...order,
    userId: order.userId ?? "",
    shippingAddress: order.shippingAddress as ShippingAddress,
    paymentResult: order.paymentResult as {
      id: string;
      status: string;
      email_address: string;
      pricePaid: string;
    },
    user: order.user
      ? {
          ...order.user,
          email: order.user.email ?? "",
        }
      : {
          name: "",
          email: "",
        },
  };

  return (
    <div className="min-h-screen text-accent">
      <OrderDetailsTable
        order={orderDetails}
        stripeClientSecret={clientSecret}
        isAdmin={session?.user?.role === "admin"}
      />
    </div>
  );
};

export default OrderDetailsPage;
