"use client";

import { useRouter } from "@/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useTranslations } from "next-intl";

import { paymentMethodSchema } from "@/lib/validators";
import CheckoutSteps from "@/app/[locale]/components/shared/checkout-steps";
import {
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_METHODS,
} from "@/lib/constants";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";

import { Button } from "@/app/[locale]/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/[locale]/components/ui/form";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/app/[locale]/components/ui/radio-group";

import { Loader } from "lucide-react";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const t = useTranslations("PaymentMethod");

  const router = useRouter();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (
    values: z.infer<typeof paymentMethodSchema>,
  ) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push("/place-order");
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "Stripe":
        return t("stripe");

      case "CashOnDelivery":
        return t("cashOnDelivery");

      default:
        return method;
    }
  };

  return (
    <div className="mt-6 mb-10 flex flex-col items-center px-4 text-accent sm:mt-10 sm:px-6">
      <CheckoutSteps current={2} />

      <div className="mx-auto w-full max-w-md space-y-4">
        <h1 className="h2-bold mt-4">
          {t("title")}
        </h1>

        <p className="text-sm text-muted-foreground">
          {t("description")}
        </p>

        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <FormItem
                          key={method}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={method} />
                          </FormControl>

                          <FormLabel className="font-normal">
                            {getPaymentMethodLabel(method)}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                t("continue")
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PaymentMethodForm;