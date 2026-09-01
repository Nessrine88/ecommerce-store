"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Cart } from "@/types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@base-ui/react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <div className="flex-1 h-[calc(100vh_-_100px)] text-accent">
      {!cart || cart.items.length === 0 ? (
        <div className="text-accent">
          Cart is empty .{" "}
          <Link className="underline " href={"/"}>
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid mt-10 md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3 text-accent">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
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
                        <span className="px-2"> {item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
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
                              return;
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
                      <span>{item.qty} </span>
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
                              return;
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
                    </TableCell>
                    <TableCell className="text-right">$ {item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent>
              <div className="space-x-4 ">
                Subtotal({cart.items.reduce((a, c) => a + c.qty, 0)})
              </div>
              <br />
              <span>{formatCurrency(cart.itemsPrice)}</span>
              <br />
              <Button
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
              >
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="flex items-center border  px-2 cursor-pointer mt-5">
                    <ArrowRight className="w-4 h-4 font-bold" />
                    PROCEED TO CHECKOUT
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
