import { Metadata } from "next";
import { notFound } from "next/navigation";

import OrderDetailsTable from "./order-details-table";
import { getOrderById } from "@/lib/actions/order.actions";
import { ShippingAddress } from "@/types";

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

  return (
    <div className="min-h-screen text-accent">
      <OrderDetailsTable
  order={{
    ...order,
    userId: order.userId || "",
    shippingAddress: order.shippingAddress as ShippingAddress,
    user: {
      name: order.user?.name ?? "Deleted User",
      email: order.user?.email ?? "",
    },
  }}

/>
    </div>
  );
};

export default OrderDetailsPage;