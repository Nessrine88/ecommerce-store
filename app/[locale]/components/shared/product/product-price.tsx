"use client";

import { cn } from "@/lib/utils";
import { useCurrency } from "@/app/[locale]/context/currency-context";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const { currency } = useCurrency();

  const stringValue = value.toFixed(2);
  const [intValue, floatValue] = stringValue.split(".");

  return (
    <div>
      <p className={cn("text-2xl", className)}>
        <span className="text-xs align-super">
          {currency}
        </span>

        {intValue}

        <span className="text-xs align-super">
          .{floatValue}
        </span>
      </p>
    </div>
  );
};

export default ProductPrice;