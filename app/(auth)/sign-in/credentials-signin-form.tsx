'use client';

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button, Input } from "@base-ui/react";

import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/app/lib/constants";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";
function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-primary py-3 font-medium text-white transition hover:bg-accent"
    >
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  );
}

export default function CredentialsSignInForm() {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });
 const searchParams = useSearchParams();
 const callbackUrl = searchParams.get('/callbackUrl') || '/'
  return (
    <form action={action} className="space-y-6">
        <input type="hidden" name= "callbackUrl" value = "callbackUrl"  />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={signInDefaultValues.email}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
        </div>

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          defaultValue={signInDefaultValues.password}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <SignInButton />

      {data && !data.success && (
        <p className="text-center text-sm text-white bg-red-300 rounded-4xl w-fit mx-auto px-5 py-2 ">
          {data.message}
        </p>
      )}

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-secondary hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}