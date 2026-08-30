import Stripe from "stripe";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order.actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const StripePaymentSuccessPage = async (props: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const { orderId } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  const order = await getOrderById(orderId);
  if (!order) notFound();

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.metadata.orderId == null || paymentIntent.metadata.orderId !== order.id) {
    return notFound();
  }

  const isSuccess = paymentIntent.status === "succeeded";

  if (!isSuccess) {
    return (
      <div className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-4 py-16">
        <h1 className="text-3xl font-bold">Payment failed</h1>
        <p className="text-muted-foreground">
          We couldn&apos;t confirm your payment. Please try again.
        </p>
        <Button >
          <Link href={`/order/${orderId}`}>View order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Thanks for your purchase</h1>
      <p className="text-muted-foreground">
        We are processing your order and will keep you posted.
      </p>
      <Button >
        <Link href={`/order/${orderId}`}>View order</Link>
      </Button>
    </div>
  );
};

export default StripePaymentSuccessPage;