"use client";

import { useState } from "react";
import { useRouter } from "@/navigation";
import { Check, Loader } from "lucide-react";
import { Button } from "@/app/[locale]/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { useTranslations } from "next-intl";

const PlaceOrderForm = () => {
  const t = useTranslations("PlaceOrder");

  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (pending) return; // Prevent duplicate submissions

    setPending(true);

    try {
      const res = await createOrder();

      if (res.redirectTo) {
        router.push(res.redirectTo);
      } else {
        console.error(
          "Order failed:",
          res.message ?? "(no message)",
          res,
        );
      }
    } catch (err) {
      console.error("createOrder threw:", err);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 w-full">
      <Button
        type="submit"
        disabled={pending}
        className="w-full"
      >
        {pending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}

        {" "}

        {t("placeOrder")}
      </Button>
    </form>
  );
};

export default PlaceOrderForm;