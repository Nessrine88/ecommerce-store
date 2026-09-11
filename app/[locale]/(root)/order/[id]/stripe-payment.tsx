"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import StripeForm from "./stripe-form";

// Hoisted outside the component so it's only created once, not on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const StripePayment = ({
  priceInCents,
  orderId,
  clientSecret,
}: {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
}) => {
  const { theme, systemTheme } = useTheme();

  const stripeTheme =
    theme === "dark"
      ? "night"
      : theme === "light"
        ? "stripe"
        : systemTheme === "dark"
          ? "night"
          : "stripe";

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme: stripeTheme,
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm priceInCents={priceInCents} orderId={orderId} />
    </Elements>
  );
};

export default StripePayment;
