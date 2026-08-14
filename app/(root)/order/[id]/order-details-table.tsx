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
const OrderDetailsTable = ({
  order,
  isAdmin,
}: {
  order: Order;
  isAdmin: boolean;
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
    const [isPending, startTranssition] = useTransition();
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTranssition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            res.success ? toast.success(res.message) : toast.error(res.message);
          })
        }
      >
        {isPending ? "processing..." : "Mark As Paid"}
      </Button>
    );
  };

  const MarkAsDeliveredButton = () => {
    const [isPending, startTranssition] = useTransition();
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTranssition(async () => {
            const res = await deliverOrder(order.id);
            res.success ? toast.success(res.message) : toast.error(res.message);
          })
        }
      >
        {isPending ? "processing..." : "Mark As Delivered"}
      </Button>
    );
  };
  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          {/* Payment */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl">Payment Method</h2>

              <p>{paymentMethod}</p>

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
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl">Shipping Address</h2>

              <p>{shippingAddress.fullName}</p>

              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city}
              </p>

              <p>
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>

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
          <Card>
            <CardContent className="p-4">
              <h2 className="pb-4 text-xl">Order Items</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="ml-2">{item.name}</span>
                        </Link>
                      </TableCell>

                      <TableCell>{item.qty}</TableCell>

                      <TableCell>{formatCurrency(item.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{formatCurrency(itemsPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(taxPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(shippingPrice)}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{formatCurrency(itemsPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(taxPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatCurrency(shippingPrice)}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              {/*Cash on delivery */}

              {isAdmin && paymentMethod === "CashOnDelivery" && (
                <MarkAsPaidButton />
              )}

              {isAdmin && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
