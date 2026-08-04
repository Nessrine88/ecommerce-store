'use client';

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { paymentMethodSchema } from "@/lib/validators";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader } from "lucide-react";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push("/place-order");
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen mt-10 text-accent ">
      <CheckoutSteps current={2} />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">
          Please select your preferred payment method
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
                            {method}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PaymentMethodForm;