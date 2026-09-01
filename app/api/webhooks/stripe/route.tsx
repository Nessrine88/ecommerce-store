import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("❌ Missing stripe-signature");

      return NextResponse.json(
        { message: "Missing stripe signature" },
        { status: 400 },
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ STRIPE_WEBHOOK_SECRET is missing");

      return NextResponse.json(
        { message: "Webhook secret is missing" },
        { status: 500 },
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (!orderId) {
        console.error("❌ No orderId found in PaymentIntent metadata");

        return NextResponse.json(
          { message: "Order ID missing" },
          { status: 400 },
        );
      }

      await updateOrderToPaid({
        orderId,

        paymentResult: {
          id: paymentIntent.id,
          status: "COMPLETED",
          email_address: paymentIntent.receipt_email ?? "",
          pricePaid: (paymentIntent.amount / 100).toFixed(2),
        },
      });

      return NextResponse.json({
        message: "updateOrderToPaid was successful",
      });
    }

    return NextResponse.json({
      message: `Event ${event.type} ignored`,
    });
  } catch (error) {
    console.error("🔥 STRIPE WEBHOOK ERROR:", error);

    return NextResponse.json(
      {
        message: "Webhook error",
      },
      { status: 400 },
    );
  }
}
