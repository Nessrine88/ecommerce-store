"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/app/[locale]/components/ui/card";
import { Badge } from "@/app/[locale]/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/[locale]/components/ui/table";
import Image from "next/image";
import { Link } from "@/navigation";
import {
  updateOrderToPaidCOD,
  deliverOrder,
} from "@/lib/actions/order.actions";
import { useTransition } from "react";
import { Button } from "@/app/[locale]/components/ui/button";
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
  const t = useTranslations("OrderDetails");

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

            res.success
              ? toast.success(res.message)
              : toast.error(res.message);
          })
        }
      >
        {isPending ? t("processing") : t("markAsPaid")}
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

            res.success
              ? toast.success(res.message)
              : toast.error(res.message);
          })
        }
      >
        {isPending ? t("processing") : t("markAsDelivered")}
      </Button>
    );
  };

  return (
    <div className="mx-auto mb-10 max-w-7xl">
      {/* Order title */}
      <h1 className="py-4 text-2xl font-semibold tracking-tight">
        {t("order")} {formatId(id)}
      </h1>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="col-span-2 space-y-4 overflow-x-auto">

          {/* Payment */}
          <Card className="rounded-xl border shadow-sm">
            <CardContent className="space-y-3 p-4">
              <h2 className="text-xl font-medium">
                {t("paymentMethod")}
              </h2>

              <p className="text-sm text-muted-foreground">
                {paymentMethod}
              </p>

              {isPaid ? (
                <Badge variant="secondary">
                  {t("paidAt", {
                    date: formatDateTime(paidAt!).datetime,
                  })}
                </Badge>
              ) : (
                <Badge variant="destructive">
                  {t("notPaid")}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card className="rounded-xl border shadow-sm">
            <CardContent className="space-y-3 p-4">
              <h2 className="text-xl font-medium">
                {t("shippingAddress")}
              </h2>

              <div className="space-y-0.5 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {shippingAddress.fullName}
                </p>

                <p>
                  {shippingAddress.streetAddress},{" "}
                  {shippingAddress.city}
                </p>

                <p>
                  {shippingAddress.postalCode},{" "}
                  {shippingAddress.country}
                </p>
              </div>

              {isDelivered ? (
                <Badge variant="secondary">
                  {t("deliveredAt", {
                    date: formatDateTime(deliveredAt!).datetime,
                  })}
                </Badge>
              ) : (
                <Badge variant="destructive">
                  {t("notDelivered")}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="rounded-xl border shadow-sm">
            <CardContent className="p-4">
              <h2 className="pb-4 text-xl font-medium">
                {t("orderItems")}
              </h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("item")}</TableHead>

                    <TableHead className="text-center">
                      {t("quantity")}
                    </TableHead>

                    <TableHead className="text-right">
                      {t("price")}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow
                      key={item.slug}
                      className="transition-colors hover:bg-muted/50"
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

                          <span className="line-clamp-2">
                            {item.name}
                          </span>
                        </Link>
                      </TableCell>

                      <TableCell className="text-center">
                        {item.qty}
                      </TableCell>

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
        <div className="mb-4 space-y-4 md:sticky md:top-4 md:self-start">

          <Card className="rounded-xl border shadow-sm">
            <CardContent className="space-y-2 p-4">

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("items")}
                </span>

                <span>
                  {formatCurrency(itemsPrice)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("tax")}
                </span>

                <span>
                  {formatCurrency(taxPrice)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("shipping")}
                </span>

                <span>
                  {formatCurrency(shippingPrice)}
                </span>
              </div>

              <div className="my-1 h-px bg-border" />

              <div className="flex justify-between text-lg font-semibold">
                <span>{t("total")}</span>

                <span>
                  {formatCurrency(totalPrice)}
                </span>
              </div>

            </CardContent>
          </Card>

          {/* Payment action - Stripe */}
          {!isPaid &&
            paymentMethod === "Stripe" &&
            stripeClientSecret && (
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

          {/* Payment action - COD */}
          {isAdmin &&
            !isPaid &&
            paymentMethod === "CashOnDelivery" && (
              <Card className="rounded-xl border shadow-sm">
                <CardContent className="p-4">
                  <MarkAsPaidButton />
                </CardContent>
              </Card>
            )}

          {/* Delivery action */}
          {isAdmin && !isDelivered && (
            <Card className="rounded-xl border shadow-sm">
              <CardContent className="p-4">
                <MarkAsDeliveredButton />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsTable;