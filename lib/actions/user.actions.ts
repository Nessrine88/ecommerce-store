"use server";

import { auth, signIn, signOut } from "@/auth";
import { paymentMethodSchema, shippingAddressSchema, signInFormSchema, signUpFormSchema } from "@/lib/validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { AuthError } from "next-auth";
import { count, eq } from "drizzle-orm";

import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { ShippingAddress } from "@/types";
import { id } from "zod/v4/locales";
import z, { success } from "zod";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";

function formatError(error: unknown) {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

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


export async function getUserById(userId: string){
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })
  if(!user) throw new Error('User not found');
  return user;
}

//Update the user's address 
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session?.user?.id as string),
    });

    if (!currentUser) throw new Error('User not found');

    const address = shippingAddressSchema.parse(data);

    await db
      .update(users)
      .set({ address })
      .where(eq(users.id, currentUser.id));

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}


//Update user's payment method 

export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    // Validate input against schema
    const parsed = paymentMethodSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid payment method data provided.",
      };
    }

    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be signed in to update your payment method.",
      };
    }

    // Confirm the user exists
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!currentUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Update the payment method
    await db
      .update(users)
      .set({ paymentMethod: parsed.data.type })
      .where(eq(users.id, currentUser.id));

    // Revalidate any cached pages that show this data
    revalidatePath("/account");

    return {
      success: true,
      message: "Payment method updated successfully.",
    };
  } catch (error) {
    console.error("updateUserPaymentMethod error:", error);
    return {
      success: false,
      message: "Something went wrong while updating your payment method.",
    };
  }
}

//Shema for updating the user profile
export const updateUserProfile = async (user: { name: string; email: string }) => {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Not authenticated');

    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });
    if (!currentUser) throw new Error('User Not Found');

    await db
      .update(users)
      .set({ name: user.name })
      .where(eq(users.id, currentUser.id));

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};



//Get all users 

export async function getAllUsers({
  limit = PAGE_SIZE,
  page = 1,
}) {
  const data = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    limit,
    offset: (page - 1) * limit,
  });

  const [{ dataCount }] = await db
    .select({ dataCount: count() })
    .from(users);

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}