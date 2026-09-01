"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import {
  updateOrderToPaidCOD,
  deliverOrder,
} from "@/lib/actions/order.actions";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import { toast } from "sonner";
import StripePayment from "./stripe-payment";

const OrderDetailsTable = ({
  order,
  isAdmin,
  stripeClientSecret,
}: {
  order: Order;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    id,
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button
        type="button"
        className="w-full"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            res.success ? toast.success(res.message) : toast.error(res.message);
          })
        }
      >
        {isPending ? "Processing..." : "Mark As Paid"}
      </Button>
    );
  };

  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button
        type="button"
        className="w-full"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            res.success ? toast.success(res.message) : toast.error(res.message);
          })
        }
      >
        {isPending ? "Processing..." : "Mark As Delivered"}
      </Button>
    );
  };

  return (
    <>
      <h1 className="py-4 text-2xl font-semibold tracking-tight">
        Order {formatId(id)}
      </h1>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          {/* Payment */}
          <Card className="rounded-xl border shadow-sm">
            <CardContent className="p-4 space-y-3">
              <h2 className="text-xl font-medium">Payment Method</h2>
              <p className="text-sm text-muted-foreground">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(paidAt!).datetime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Paid</Badge>
              )}
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card className="rounded-xl border shadow-sm">
            <CardContent className="p-4 space-y-3">
              <h2 className="text-xl font-medium">Shipping Address</h2>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="text-foreground font-medium">
                  {shippingAddress.fullName}
                </p>
                <p>
                  {shippingAddress.streetAddress}, {shippingAddress.city}
                </p>
                <p>
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </div>
              {isDelivered ? (
                <Badge variant="secondary">
                  Delivered at {formatDateTime(deliveredAt!).datetime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="rounded-xl border shadow-sm">
            <CardContent className="p-4">
              <h2 className="pb-4 text-xl font-medium">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow
                      key={item.slug}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center gap-3"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md border object-cover"
                          />
                          <span className="line-clamp-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">{item.qty}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-4 mb-4 md:sticky md:top-4 md:self-start">
          <Card className="rounded-xl border shadow-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span>{formatCurrency(itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(taxPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCurrency(shippingPrice)}</span>
              </div>
              <div className="my-1 h-px bg-border" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment action (Stripe or COD) */}
          {!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
            <Card className="rounded-xl border shadow-sm">
              <CardContent className="p-4">
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                />
              </CardContent>
            </Card>
          )}

          {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
            <Card className="rounded-xl border shadow-sm">
              <CardContent className="p-4">
                <MarkAsPaidButton />
              </CardContent>
            </Card>
          )}

          {isAdmin && !isDelivered && (
            <Card className="rounded-xl border shadow-sm">
              <CardContent className="p-4">
                <MarkAsDeliveredButton />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
