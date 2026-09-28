"use server";
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
import { getTranslations } from "next-intl/server";
import Devises from "../../devises";

const Menu = async () => {
  const cart = await getMyCart();
  const t = await getTranslations("Menu");
  const cartCount = Array.isArray(cart?.items)
    ? cart.items.reduce((acc, item) => acc + item.qty, 0)
    : 0;

  return (
    <div>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
        <ModeToggle />
        <SelectedLanguage />
        <Devises />

        <Button variant="ghost" className="relative px-2.5 lg:px-4" >
          <Link
            href={`/cart`}
            className="flex items-center gap-1.5 lg:gap-2 hover:text-primary"
          >
            <ShoppingCart className="w-5 h-5 shrink-0" />
            <span className="hidden lg:inline">{t("cart")}</span>
            {cartCount > 0 && (
              <span className="absolute -end-1.5 -top-1.5 rounded-full bg-primary text-primary-foreground text-[10px] leading-none min-w-[1.1rem] h-[1.1rem] flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </Link>
        </Button>

        <UserButton />
      </nav>

      {/* Mobile nav */}
      <nav className="md:hidden bg-bg">
        <Sheet>
          <SheetTrigger className="align-middle p-2 -m-2">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex flex-col items-stretch text-accent p-6 sm:p-8 gap-3 w-[85vw] max-w-sm overflow-y-auto"
          >
            <SheetTitle>{t("menuTitle")}</SheetTitle>

            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center justify-between gap-2">
                <ModeToggle />
                <SelectedLanguage />
                <Devises />
              </div>

              <Button variant="ghost" className="relative justify-start w-full" >
                <Link
                  href={`/cart`}
                  className="flex items-center gap-2 hover:text-primary w-full"
                >
                  <ShoppingCart className="w-5 h-5 shrink-0" />
                  <span>{t("cart")}</span>
                  {cartCount > 0 && (
                    <span className="ms-auto rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>

              <UserButton />
            </div>

          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;