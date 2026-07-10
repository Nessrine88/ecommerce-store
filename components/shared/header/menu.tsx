import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link";
import {Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Menu = () => {
  return (
    <div>
      <nav className="hidden md:flex">
        <Button>
          <ModeToggle />
        </Button>

        <Button variant="ghost">
          <Link href="/sign-in" className="flex gap-2 hover:text-primary">
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <Button variant="ghost">
          <Link href="/sign-in" className="flex gap-2 hover:text-primary">
            <UserIcon /> <span className="">Sign-in</span>
          </Link>
        </Button>
      </nav>
      <nav className="md:hidden bg-bg ">
        <Sheet  >
            <SheetTrigger className='align-middle'>
                <EllipsisVertical />
            </SheetTrigger >
            <SheetContent className='flex flex-col items-start text-accent  p-10'>
                <SheetTitle>
                    Menu
                </SheetTitle>
               <Button variant="ghost">
                     <ModeToggle />
                    
                </Button>
                <Button variant="ghost">
                  
                    <Link href ="/cart" > <ShoppingCart /> </Link>
                </Button>
                  <Button variant="ghost">
          <Link href="/sign-in" className="flex gap-2 hover:text-primary">
            <UserIcon /> <span className="">Sign-in</span>
          </Link>
        </Button>
                <SheetDescription>

                </SheetDescription>
            </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
