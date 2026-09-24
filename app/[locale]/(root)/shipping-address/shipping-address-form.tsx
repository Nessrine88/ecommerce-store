"use client";

import { useTransition } from "react";
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validators";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "@/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/[locale]/components/ui/form";

import { Input } from "@/app/[locale]/components/ui/input";
import { Button } from "@/app/[locale]/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";

const ShippingAddressForm = ({
  address,
}: {
  address: ShippingAddress;
}) => {
  const t = useTranslations("ShippingAddress");

  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (
    values: z.infer<typeof shippingAddressSchema>,
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push("/payment-method");
    });
  };

  return (
    <div className="my-5 mx-auto max-w-2xl space-y-4 px-4 text-accent sm:px-6">
      <h1 className="h2-bold mt-4">
        {t("title")}
      </h1>

      <p className="text-sm text-muted-foreground">
        {t("description")}
      </p>

      <Form {...form}>
        <form
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Full Name */}
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("fullName")}
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder={t("fullNamePlaceholder")}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("address")}
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder={t("addressPlaceholder")}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("city")}
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder={t("cityPlaceholder")}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Country + Postal Code */}
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("country")}
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder={t("countryPlaceholder")}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("postalCode")}
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder={t("postalCodePlaceholder")}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Continue */}
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}

              {" "}

              {t("continue")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ShippingAddressForm;