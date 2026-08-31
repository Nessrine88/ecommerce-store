import Stripe from 'stripe';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getOrderById } from '@/lib/actions/order.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const StripePaymentSuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    payment_intent?: string;
  }>;
}) => {
  const { id } = await props.params;

  const { payment_intent: paymentIntentId } =
    await props.searchParams;

  console.log('SUCCESS PAGE');
  console.log('ORDER ID:', id);
  console.log('PAYMENT INTENT:', paymentIntentId);

  if (!paymentIntentId) {
    notFound();
  }

  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const paymentIntent =
    await stripe.paymentIntents.retrieve(paymentIntentId);

  console.log('PAYMENT INTENT:', paymentIntent);
  console.log('METADATA:', paymentIntent.metadata);

  if (paymentIntent.metadata.orderId !== order.id) {
    notFound();
  }

  const isSuccess =
    paymentIntent.status === 'succeeded';

  if (!isSuccess) {
    return (
      <div className="flex text-accent min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">
          Payment failed
        </h1>

        <Button >
          <Link href={`/order/${id}`}>
            View order
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex text-accent  min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold">
        Thanks for your purchase
      </h1>

      <p className="text-muted-foreground">
        We are processing your order and will keep you posted.
      </p>

      <Button >
        <Link href={`/order/${id}`}>
          View order
        </Link>
      </Button>
    </div>
  );
};
export default StripePaymentSuccessPage;