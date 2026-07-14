'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { Plus } from "lucide-react";
import { CartItem } from "@/types";
const AddToCart = ({item}:{item: CartItem}) => {
  return (
    <div>
      Add To card
    </div>
  )
}

export default AddToCart
