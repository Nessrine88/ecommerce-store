import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
    title: 'Shipping Address'
}
async function  ShppingAddressPage () {
    const cart = await getMyCart();
  if (!cart || !(cart.items as ShippingAddress[] | undefined)?.length) redirect('/cart');
    const session = await auth();
    const userId = session?.user?.id;
    if(!userId) {throw new Error('No user ID')};
    const user = await getUserById(userId)
  return (
    <div>
      shipping address component
    </div>
  )
}

export default ShppingAddressPage
