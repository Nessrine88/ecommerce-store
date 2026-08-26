"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";

const PlaceOrderForm = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (pending) return; // Prevent duplicate submissions

    setPending(true);

    try {
      const res = await createOrder();
      if (res.redirectTo) {
        router.push(res.redirectTo);
      } else {
        console.error("Order failed:", res.message ?? "(no message)", res);
      }
    } catch (err) {
      console.error("createOrder threw:", err);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-10">
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}{" "}
        Place order
      </Button>
    </form>
  );
};

export default PlaceOrderForm;