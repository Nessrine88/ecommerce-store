"use client";

import { useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const StripeForm = ({
  priceInCents,
  orderId,
}: {
  priceInCents: number;
  orderId: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/${orderId}/stripe-payment-success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setErrorMessage(error.message ?? "An error occurred with your payment");
    } else {
      setErrorMessage("An unexpected error occurred");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      <PaymentElement />

      {errorMessage && (
        <div className="text-sm font-medium text-destructive">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={stripe == null || elements == null || isLoading}
        className="w-full"
      >
        {isLoading
          ? "Processing..."
          : `Pay ${formatCurrency(priceInCents / 100)}`}
      </Button>
    </form>
  );
};

export default StripeForm;
