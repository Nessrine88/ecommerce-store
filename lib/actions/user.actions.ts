"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema, signUpFormSchema } from "@/app/lib/validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";

import { db } from "@/app/db";
import { users } from "@/app/db/schema";

import { formatError } from "@/app/lib/constants";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const validatedFields = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const result = await signIn("credentials", {
      email: validatedFields.email,
      password: validatedFields.password,
      redirect: false,
    });

    if (!result) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    return {
      success: true,
      message: "Signed in successfully",
    };

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      return {
        success: false,
        message: "Authentication error",
      };
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
}


export async function signOutUser() {
  await signOut();
}


export async function signUpUser(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });


    // Check existing user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });


    if (existingUser) {
      return {
        success: false,
        message: "Email already exists",
      };
    }


    const hashedPassword = hashSync(user.password, 10);


    await db.insert(users).values({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });


    // Automatically login after registration
    await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: false,
    });


    return {
      success: true,
      message: "User registered successfully",
    };


  } catch (error) {

    if (isRedirectError(error)) {
      throw error;
    }


    return {
      success: false,
      message: formatError(error),
    };
  }
}