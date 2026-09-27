"use client";

import { useCurrency } from "../context/currency-context";
import { formatCurrency } from "@/lib/utils";

export default function CurrencyPrice({
  price,
}: {
  price: number;
}) {
  const {currency} = useCurrency();

  return <>{formatCurrency(price, currency)}</>;
}