import { Metadata } from "next";
import { notFound } from "next/navigation";

import OrderDetailsTable from "./order-details-table";
import { getOrderById } from "@/lib/actions/order.actions";
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import Stripe from 'stripe';
export const metadata: Metadata = {
  title: "Order Details",
};

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
  let client_secret = null;
  //Check if is not paid and using stripe 
  if(order.paymentMethod === 'Stripe' && !order.isPaid){
    //Init stripe instance 
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    //Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: {orderId:order.id}

    });
    client_secret = paymentIntent.client_secret
  }

  const orderDetails = {
    ...order,
    userId: order.userId ?? "",
    shippingAddress: order.shippingAddress as ShippingAddress,
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
        stripeClientSecret={client_secret}
        isAdmin={session?.user?.role === "admin" || false}
      />
    </div>
  );
};

export default OrderDetailsPage;