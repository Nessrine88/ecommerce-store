"use server";
import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";
import { getMyCart } from "@/lib/actions/cart.actions";

const Menu = async () => {
  const cart = await getMyCart();
  const cartCount = Array.isArray(cart?.items)
    ? cart.items.reduce((acc, item) => acc + item.qty, 0)
    : 0;

  return (
    <div>
      <nav className="hidden md:flex items-center gap-2">
        <ModeToggle />

        <Button variant="ghost" className="relative">
          <Link href="/cart" className="flex gap-2 hover:text-primary">
            <ShoppingCart />
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </Button>

        <UserButton />
      </nav>

      <nav className="md:hidden bg-bg">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start text-accent p-10 gap-2">
            <SheetTitle>Menu</SheetTitle>

            <ModeToggle />

            <Button variant="ghost" className="relative">
              <Link href="/cart" className="flex gap-2 hover:text-primary">
                <ShoppingCart />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            <UserButton />

            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
