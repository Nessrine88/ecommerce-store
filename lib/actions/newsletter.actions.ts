"use server";

import { db } from "@/app/db";
import { newsletterSubscribers } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function subscribeToNewsletter(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (
    !normalizedEmail ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const [existing] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, normalizedEmail))
      .limit(1);

    if (existing?.isSubscribed) {
      return {
        success: true,
        message: "This email is already subscribed!",
      };
    }

    if (existing) {
      await db
        .update(newsletterSubscribers)
        .set({
          isSubscribed: true,
          subscribedAt: new Date(),
          unsubscribedAt: null,
        })
        .where(eq(newsletterSubscribers.email, normalizedEmail));
    } else {
      await db.insert(newsletterSubscribers).values({
        email: normalizedEmail,
      });
    }

    return {
      success: true,
      message: "Thank you for subscribing!",
    };
  } catch (error) {
    console.error("Newsletter subscription failed:", error);

    return {
      success: false,
      message: "Unable to subscribe right now. Please try again.",
    };
  }
}