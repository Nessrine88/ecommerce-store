"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button, Input } from "@base-ui/react";

import { Label } from "@/app/[locale]/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import { signUpUser } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

function SignUpButton() {
  const t = useTranslations("SignUp");
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-primary py-3 font-medium text-accent transition hover:bg-accent"
    >
      {pending ? t("submitting") : t("signUp")}
    </Button>
  );
}

export default function SignUpForm() {
  const t = useTranslations("SignUp");

  const [data, action] = useActionState(
    signUpUser,
    {
      success: false,
      message: "",
    }
  );

  const searchParams = useSearchParams();

  const callbackUrl =
    searchParams.get("callbackUrl") || "/";

  return (
    <form action={action} className="space-y-6">
      <input
        type="hidden"
        name="callbackUrl"
        value={callbackUrl}
      />

      <div className="space-y-2">
        <Label htmlFor="name">
          {t("name")}
        </Label>

        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={signUpDefaultValues.name}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          {t("email")}
        </Label>

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={signUpDefaultValues.email}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          {t("password")}
        </Label>

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          defaultValue={signUpDefaultValues.password}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          {t("confirmPassword")}
        </Label>

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          defaultValue={signUpDefaultValues.confirmPassword}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <SignUpButton />

      {data && !data.success && (
        <p className="mx-auto w-fit rounded-4xl px-5 py-2 text-center text-sm text-white">
          {data.message}
        </p>
      )}

      <p className="text-center text-sm text-gray-500">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/sign-in"
          className="font-medium text-secondary hover:underline"
        >
          {t("signIn")}
        </Link>
      </p>
    </form>
  );
}