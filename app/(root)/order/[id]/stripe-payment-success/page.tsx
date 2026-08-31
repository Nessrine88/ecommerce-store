import Stripe from 'stripe';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getOrderById } from '@/lib/actions/order.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const StripePaymentSuccessPage = async (props: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{
    payment_intent?: string;
  }>;
}) => {
  const { orderId } = await props.params;

  const { payment_intent: paymentIntentId } =
    await props.searchParams;

  console.log('SUCCESS PAGE');
  console.log('ORDER ID:', orderId);
  console.log('PAYMENT INTENT:', paymentIntentId);

  if (!paymentIntentId) {
    console.log('NO PAYMENT INTENT');
    notFound();
  }

  const order = await getOrderById(orderId);

  console.log('ORDER:', order);

  if (!order) {
    console.log('ORDER NOT FOUND');
    notFound();
  }

  const paymentIntent =
    await stripe.paymentIntents.retrieve(paymentIntentId);

  console.log('PAYMENT INTENT STATUS:', paymentIntent.status);
  console.log('PAYMENT INTENT METADATA:', paymentIntent.metadata);

  if (paymentIntent.metadata.orderId !== order.id) {
    console.log('ORDER ID DOES NOT MATCH');
    notFound();
  }

  if (paymentIntent.status !== 'succeeded') {
    return (
      <div>
        <h1>Payment failed</h1>

        <Button >
          <Link href={`/order/${orderId}`}>
            View order
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1>Thanks for your purchase</h1>

      <p>
        We are processing your order and will keep you posted.
      </p>

      <Button >
        <Link href={`/order/${orderId}`}>
          View order
        </Link>
      </Button>
    </div>
  );
};

export default StripePaymentSuccessPage;