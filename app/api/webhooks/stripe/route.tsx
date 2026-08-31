import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.actions';

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

export async function POST(req: NextRequest) {
  console.log('🔥 STRIPE WEBHOOK RECEIVED');

  try {
    const body = await req.text();

    const signature = req.headers.get(
      'stripe-signature'
    );

    console.log('Has signature:', !!signature);
    console.log(
      'Has webhook secret:',
      !!process.env.STRIPE_WEBHOOK_SECRET
    );

    if (!signature) {
      console.error('❌ Missing stripe-signature');

      return NextResponse.json(
        { message: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error(
        '❌ STRIPE_WEBHOOK_SECRET is missing'
      );

      return NextResponse.json(
        { message: 'Webhook secret is missing' },
        { status: 500 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('✅ Stripe signature verified');
    console.log('Event type:', event.type);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent =
        event.data.object as Stripe.PaymentIntent;

      console.log(
        '💰 PaymentIntent:',
        paymentIntent.id
      );

      console.log(
        '📦 Order ID:',
        paymentIntent.metadata.orderId
      );

      const orderId = paymentIntent.metadata.orderId;

      if (!orderId) {
        console.error(
          '❌ No orderId found in PaymentIntent metadata'
        );

        return NextResponse.json(
          { message: 'Order ID missing' },
          { status: 400 }
        );
      }

      await updateOrderToPaid({
        orderId,

        paymentResult: {
          id: paymentIntent.id,
          status: 'COMPLETED',
          email_address:
            paymentIntent.receipt_email ?? '',
          pricePaid: (
            paymentIntent.amount / 100
          ).toFixed(2),
        },
      });

      console.log(
        '✅ Order successfully marked as paid'
      );

      return NextResponse.json({
        message: 'updateOrderToPaid was successful',
      });
    }

    console.log(
      'ℹ️ Event ignored:',
      event.type
    );

    return NextResponse.json({
      message: `Event ${event.type} ignored`,
    });
  } catch (error) {
    console.error(
      '🔥 STRIPE WEBHOOK ERROR:',
      error
    );

    return NextResponse.json(
      {
        message: 'Webhook error',
      },
      { status: 400 }
    );
  }
}