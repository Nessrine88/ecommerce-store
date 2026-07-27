'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Cart, CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";

const AddToCart = ({cart, item }: {cart?: Cart, item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(`${item.name} added to cart!`, {
      action: {
        label: "Go to Cart",
        onClick: () => router.push("/cart"),
      },
    });

    // Refresh server components (cart badge, etc.)
    router.refresh();
  };
  const handleRemoveFromCart = async ()=> {
    const res = await removeItemFromCart(item.productId)
   if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(`${item.name} deleted from cart!`, {
      action: {
        label: "Go to Cart",
        onClick: () => router.push("/cart"),
      },
    });

  }
const existItem = cart && cart.items.find((x)=> x.productId === item.productId)
  return existItem ? (
    <div className="flex w-full mx-auto justify-center items-center">
      <Button
      variant="outline"
      type="button"
      onClick={handleRemoveFromCart}
      className=" flex justify-center text-accent hover:bg-bg"
    >
      <Minus className="h-4 w-4 " />
      
    </Button>
    <span className="px-2">{existItem.qty} </span>
    <Button
      variant="outline"
      type="button"
      onClick={handleAddToCart}
      className=" flex justify-center text-accent hover:bg-bg"
    >
      <Plus className="h-4 w-4 " />
      
    </Button>
    </div>
  ):(
 <Button
      variant="outline"
      type="button"
      onClick={handleAddToCart}
      className="w-full flex justify-center text-accent hover:bg-bg"
    >
      <Plus className="h-4 w-4 rounded-2xl border" />
      Add To Cart
    </Button>
  );
};

export default AddToCart;