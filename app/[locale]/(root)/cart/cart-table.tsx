"use client";

import { useRouter } from "@/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  addItemToCart,
  removeItemFromCart,
} from "@/lib/actions/cart.actions";
import {
  Loader,
  Minus,
  Plus,
} from "lucide-react";
import { Link } from "@/navigation";
import Image from "next/image";
import { Cart } from "@/types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/app/[locale]/components/ui/table";
import { Button } from "@base-ui/react";
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/app/[locale]/components/ui/card";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const t = useTranslations("Cart");

  return (
    <div className="flex-1 max-w-7xl mx-auto text-accent px-4 sm:px-0">
      {!cart || cart.items.length === 0 ? (
        <div className="text-accent py-10 text-center sm:text-left">
          {t("empty")}{" "}
          <Link className="underline" href="/">
            {t("goShopping")}
          </Link>
        </div>
      ) : (
        <div className="grid mt-6 sm:mt-10 gap-5 md:grid-cols-4">
          {/* ---------- Items ---------- */}
          <div className="md:col-span-3">
            {/* Table view (sm and up) */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">
                      {t("name")}
                    </TableHead>

                    <TableHead className="text-center">
                      {t("quantity")}
                    </TableHead>

                    <TableHead className="text-right">
                      {t("price")}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="shrink-0"
                          />

                          <span className="px-2 line-clamp-2">
                            {item.name}
                          </span>
                        </Link>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            disabled={isPending}
                            type="button"
                            onClick={() =>
                              startTransition(async () => {
                                const res = await removeItemFromCart(
                                  item.productId,
                                );

                                if (!res.success) {
                                  toast.error(res.message);
                                }
                              })
                            }
                          >
                            {isPending ? (
                              <Loader className="animate-spin w-4 h-4" />
                            ) : (
                              <Minus className="w-4 h-4" />
                            )}
                          </Button>

                          <span className="w-6 text-center">
                            {item.qty}
                          </span>

                          <Button
                            disabled={isPending}
                            type="button"
                            onClick={() =>
                              startTransition(async () => {
                                const res = await addItemToCart({
                                  ...item,
                                  qty: 1,
                                });

                                if (!res.success) {
                                  toast.error(res.message);
                                }
                              })
                            }
                          >
                            {isPending ? (
                              <Loader className="animate-spin w-4 h-4" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Card/stacked view (mobile only) */}
            <div className="flex flex-col gap-3 sm:hidden">
              {cart.items.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center gap-3 border rounded-md p-3"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    className="shrink-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="block truncate text-sm font-medium"
                    >
                      {item.name}
                    </Link>

                    <div className="text-sm text-muted-foreground mt-1">
                      {formatCurrency(item.price)}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        disabled={isPending}
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId,
                            );

                            if (!res.success) {
                              toast.error(res.message);
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="animate-spin w-4 h-4" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>

                      <span className="w-6 text-center">
                        {item.qty}
                      </span>

                      <Button
                        disabled={isPending}
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart({
                              ...item,
                              qty: 1,
                            });

                            if (!res.success) {
                              toast.error(res.message);
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className="animate-spin w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Summary ---------- */}
          <Card className="md:sticky md:top-20 h-fit">
            <CardContent className="p-4">
              <div className="text-sm sm:text-base">
                {t("subtotal")} (
                {cart.items.reduce(
                  (total, item) => total + item.qty,
                  0,
                )}
                )
              </div>

              <div className="text-lg sm:text-xl font-semibold mt-1">
                {formatCurrency(cart.itemsPrice)}
              </div>

              <Button
                disabled={isPending}
                className="w-full mt-4"
                onClick={() =>
                  startTransition(() => {
                    router.push("/shipping-address");
                  })
                }
              >
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  <div className="flex items-center justify-center gap-2 border px-2 py-2 cursor-pointer w-full">
                    <span className="text-sm sm:text-base">
                      {t("proceedToCheckout")}
                    </span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartTable;