"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema } from "@/app/lib/validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { AuthError } from "next-auth";

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // let Next's redirect through, don't swallow it
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid email or password" };
        default:
          return { success: false, message: "Something went wrong" };
      }
    }

    // Unknown error — don't swallow silently in dev, but still return state
    return { success: false, message: "Something went wrong" };
  }
}

export async function signOutUser() {
  await signOut();
}