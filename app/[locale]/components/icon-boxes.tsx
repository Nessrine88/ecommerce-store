
"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import {
  DollarSign,
  Headset,
  ShoppingBag,
  WalletCards,
} from "lucide-react";
import { useTranslations } from "next-intl";
import DealCountdown from "./deal-countdown";

const IconBoxes = () => {
  const t = useTranslations("Homepage.iconBoxes");

  return (
    <div>
      <DealCountdown />

      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-4">
          <div className="space-y-2">
            <ShoppingBag />
            <div className="text-sm font-bold">
              {t("freeShipping.title")}
            </div>
            <div className="text-sm text-accent">
              {t("freeShipping.description")}
            </div>
          </div>

          <div className="space-y-2">
            <DollarSign />
            <div className="text-sm font-bold">
              {t("moneyBack.title")}
            </div>
            <div className="text-sm text-accent">
              {t("moneyBack.description")}
            </div>
          </div>

          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold">
              {t("flexiblePayment.title")}
            </div>
            <div className="text-sm text-accent">
              {t("flexiblePayment.description")}
            </div>
          </div>

          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">
              {t("support.title")}
            </div>
            <div className="text-sm text-accent">
              {t("support.description")}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes