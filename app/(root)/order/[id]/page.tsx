import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.actions";
import NotFound from "@/app/not-found";
import { ShippingAddress } from "@/types";

export const metadata: Metadata= {
    title: 'Order Details'
}
const OrderDetailsPage = async(props: {
    params: Promise<{id:string}>
}) => {
    const {id} = await props.params;
    const order = await getOrderById(id);
    if(!order){
        NotFound();
    };
  return (
    <div className="min-h-screen text-accent">Details:{order?.totalPrice} $</div>
  )
}

export default OrderDetailsPage