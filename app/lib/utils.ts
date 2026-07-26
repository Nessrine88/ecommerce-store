import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert a Drizzle/Postgres result (with Decimal-like fields, Dates, etc.)
// into a plain JSON-serializable object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Round a number to 2 decimal places, avoiding floating point drift
// e.g. round2(1.005) -> 1.01 (rounds using integer math, not raw float ops)
// lib/utils.ts
export function round2(value: number | string) {
  const num = typeof value === 'number' ? value : Number(value)
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export function calcPrice(items: CartItem[]) {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  )
  const shippingPrice = round2(itemsPrice > 50 ? 0 : 5)
  const taxPrice = round2(0.15 * itemsPrice)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

// Format a number as a string with exactly 2 decimal places
// e.g. formatNumberWithDecimal(10) -> "10.00", formatNumberWithDecimal(9.5) -> "9.50"
export function formatNumberWithDecimal(num: number): string {
  if (!Number.isFinite(num)) {
    throw new Error("formatNumberWithDecimal: value is not a finite number");
  }

  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Normalize any thrown error (ZodError, Drizzle/Postgres error, plain Error,
// or unknown) into a user-friendly string message
export function formatError(error: unknown): string {
  // Zod validation error
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name: string }).name === "ZodError" &&
    "errors" in error
  ) {
    const zodError = error as {
      errors: Record<string, { message: string }> | { message: string }[];
    };

    const fieldErrors = Array.isArray(zodError.errors)
      ? zodError.errors.map((e) => e.message)
      : Object.values(zodError.errors).map((e) => e.message);

    return fieldErrors.join(". ");
  }

  // Postgres/Drizzle unique constraint violation (e.g. duplicate email)
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23505" &&
    "constraint" in error
  ) {
    const constraint = String((error as { constraint: string }).constraint);
    const field = constraint.split("_")[1] ?? "field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use`;
  }

  // Standard JS Error
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}