"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema, signUpFormSchema } from "@/app/lib/validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import {prisma} from '@/app/db/prisma'
import { AuthError } from "next-auth";
import { formatError } from "@/app/lib/constants";
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

export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        });
        const plainPassword = user.password
        user.password = hashSync(user.password, 10);
        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,

            }
        })
        await signIn('credentials', {
            email: user.email,
            password: plainPassword
        });
        return {success: true, message:'User registred successfully'}
    } catch (error) {
        if(isRedirectError(error)){
            throw error;
        }
         return {success: false, message:formatError(error)}
    }
}