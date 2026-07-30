
import { getMyCart } from "@/lib/actions/cart.actions";
import CartTable from "./cart-table"
export const metadata = {
    title: 'Shopping Cart'
}
const Cart = async() => {
      const cart = await getMyCart();
  return (
    <div>
     <CartTable cart={cart as any}/>
    </div>
  )
}

export default Cart
