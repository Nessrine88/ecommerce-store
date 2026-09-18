
import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { CartItem, ShippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/app/[locale]/components/shared/checkout-steps";
import { Card, CardContent } from "@/app/[locale]/components/ui/card";
import { Link } from "@/navigation";
import { Button } from "@/app/[locale]/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/[locale]/components/ui/table";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import PlaceOrderForm from "./place-order-form";

export const metadata: Metadata = {
  title: "Place Order",
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User Not Found");

  const user = await getUserById(userId);

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    redirect("/cart");
  }

  if (!user.address) {
    redirect("/shipping-address");
  }

  if (!user.paymentMethod) {
    redirect("/payment-method");
  }

  const userAddress = user.address as ShippingAddress;

  return (
    <main className=" w-full px-3 sm:px-6 lg:px-8 text-accent">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        {/* Checkout steps */}
        <div className="w-full overflow-x-auto py-4 sm:py-6">
          <CheckoutSteps current={3} />
        </div>

        {/* Page title */}
        <h1 className="mb-6 text-xl font-semibold sm:mb-8 sm:text-2xl">
          Place Order
        </h1>

        {/* Main checkout cards */}
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          
          {/* Shipping Address */}
          <Card className="w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold sm:text-xl">
                  Shipping Address
                </h2>

                <Link href="/shipping-address">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>

              <div className="space-y-1 text-sm sm:text-base">
                <p className="font-medium">{userAddress.fullName}</p>

                <p className="break-words text-muted-foreground">
                  {userAddress.streetAddress},{" "}
                  {userAddress.city}{" "}
                  {userAddress.postalCode},{" "}
                  {userAddress.country}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold sm:text-xl">
                  Payment Method
                </h2>

                <Link href="/payment-method">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>

              <p className="text-sm sm:text-base">
                {user.paymentMethod}
              </p>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="w-full lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold sm:text-xl">
                  Order Items
                </h2>

                <Link href="/cart">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>

              {/* Desktop / Tablet */}
              <div className="hidden overflow-x-auto sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">
                        Price
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {cart.items.map((item: CartItem) => (
                      <TableRow key={item.slug}>
                        <TableCell>
                          <Link
                            href={`/product/${item.slug}`}
                            className="flex min-w-0 items-center gap-3"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="h-12 w-12 shrink-0 rounded-md object-cover"
                            />

                            <span className="max-w-[180px] truncate">
                              {item.name}
                            </span>
                          </Link>
                        </TableCell>

                        <TableCell>{item.qty}</TableCell>

                        <TableCell className="text-right">
                          {formatCurrency(item.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile */}
              <div className="flex flex-col gap-3 sm:hidden">
                {cart.items.map((item: CartItem) => (
                  <Link
                    key={item.slug}
                    href={`/product/${item.slug}`}
                    className="flex w-full items-center gap-3 rounded-lg border p-3 transition hover:bg-muted"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="h-14 w-14 shrink-0 rounded-md object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>

                      <div className="mt-1 flex items-center justify-between gap-2 text-sm text-muted-foreground">
                        <span>Qty: {item.qty}</span>

                        <span className="font-medium text-foreground">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom section */}
        <div className="mt-6 grid w-full grid-cols-1 gap-6 pb-10 lg:grid-cols-3 lg:gap-8">
          
          {/* Empty space on desktop */}
          <div className="hidden lg:block lg:col-span-2" />

          {/* Order Summary + Place Order */}
          <div className="w-full">
            <Card className="w-full">
              <CardContent className="space-y-3 p-4 sm:p-6">
                
                <div className="flex items-center justify-between gap-4 text-sm sm:text-base">
                  <span>Items</span>
                  <span>{formatCurrency(cart.itemsPrice)}</span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm sm:text-base">
                  <span>Tax</span>
                  <span>{formatCurrency(cart.taxPrice)}</span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm sm:text-base">
                  <span>Shipping</span>
                  <span>{formatCurrency(cart.shippingPrice)}</span>
                </div>

                <div className="my-2 border-t" />

                <div className="flex items-center justify-between gap-4 text-base font-bold sm:text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(cart.totalPrice)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 w-full sm:mt-6">
              <PlaceOrderForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlaceOrderPage;

