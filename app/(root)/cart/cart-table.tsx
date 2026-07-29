'use client';
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Cart } from "@/types";


const CartTable = async({cart}: {cart?: Cart}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition()
  return (
    <div>
      {!cart || cart.items.length ===0 ?(
        <div>Cart is empty . <Link href={'/'}>Go Shopping</Link></div>
      ):(
        <div className="grid  md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
                Table
            </div>
        </div>
      )}
    </div>
  )
}

export default CartTable
