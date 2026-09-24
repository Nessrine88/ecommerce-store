"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const CheckoutSteps = ({ current = 0 }) => {
  const t = useTranslations("CheckoutSteps");

  const steps = [
    { key: "userLogin", label: "User Login" },
    { key: "shippingAddress", label: "Shipping Address" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "placeOrder", label: "Place Order" },
  ];

  return (
    <div className="flex items-center mx-w-7xl mx-auto text-accent flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-center text-sm",
              index === current ? "bg-secondary" : "",
            )}
          >
            {t(step.key)}
          </div>

          {index !== steps.length - 1 && (
            <hr className="w-16 border-t border-accent mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;