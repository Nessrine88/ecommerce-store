"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Minus, Plus, Loader } from "lucide-react";
import { Cart, CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
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
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(`${item.name} removed from cart!`, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });

      // Refresh server components (cart badge, etc.)
      router.refresh();
    });
  };

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div className="flex w-full mx-auto justify-center items-center">
      <Button
        variant="outline"
        type="button"
        onClick={handleRemoveFromCart}
        className="flex justify-center text-accent hover:bg-bg"
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>

      <span className="px-2">{existItem.qty}</span>

      <Button
        variant="outline"
        type="button"
        onClick={handleAddToCart}
        className="flex justify-center text-accent hover:bg-bg"
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      variant="outline"
      type="button"
      onClick={handleAddToCart}
      className="w-full flex justify-center text-accent hover:bg-bg"
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
