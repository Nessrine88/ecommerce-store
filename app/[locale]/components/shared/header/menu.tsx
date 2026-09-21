
"use server";

import { getTranslations } from "next-intl/server";
import { Button } from "@/app/[locale]/components/ui/button";
import ModeToggle from "./mode-toggle";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import { Link } from "@/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/app/[locale]/components/ui/sheet";
import UserButton from "./user-button";
import { getMyCart } from "@/lib/actions/cart.actions";
import SelectedLanguage from "./selected-language";

const Menu = async () => {
  const t = await getTranslations("Menu");

  const cart = await getMyCart();

  const cartCount = Array.isArray(cart?.items)
    ? cart.items.reduce((acc, item) => acc + item.qty, 0)
    : 0;

  return (
    <div>
      {/* Desktop */}
      <nav
        className="
          hidden md:flex
          flex-row
          rtl:flex-row-reverse
          items-center
          gap-2
        "
      >
        <ModeToggle />

        <SelectedLanguage />

        <Button variant="ghost" className="relative">
          <Link href="/cart" className="flex gap-2 hover:text-primary">
            <ShoppingCart />
            {t("cart")}

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </Button>

        <UserButton />
      </nav>

      {/* Mobile */}
      <nav className="md:hidden bg-bg">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>

          <SheetContent className="flex flex-col items-start text-accent p-10 gap-2">
            <SheetTitle>{t("menuTitle")}</SheetTitle>

            <ModeToggle />

            <Button variant="ghost" className="relative">
              <Link href="/cart" className="flex gap-2 hover:text-primary">
                <ShoppingCart />
                {t("cart")}

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            <UserButton />

            <SheetDescription />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;

