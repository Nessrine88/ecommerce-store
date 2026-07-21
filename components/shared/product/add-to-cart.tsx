'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CartItem } from "@/types";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message ?? "Product added to cart!");

    // Refresh server components (cart badge, etc.)
    router.refresh();
  };

  return (
    <Button
      variant="outline"
      type="button"
      onClick={handleAddToCart}
      className="w-full flex justify-center text-accent hover:bg-bg"
    >
      <Plus className=" h-4 w-4 rounded-2xl border  " />
      Add To Cart
    </Button>
  );
};

export default AddToCart;