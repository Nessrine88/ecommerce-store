"use server";

import { auth } from "@/auth";
import { db } from "@/app/db";
import { products, reviews } from "@/app/db/schema";
import { insertReviewSchema } from "@/lib/validators";
import { formatError } from "@/lib/utils";
import { and, avg, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    // Validate and store the review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    // Get the product that is being reviewed
    const product = await db.query.products.findFirst({
      where: eq(products.id, review.productId),
    });
    if (!product) throw new Error("Product not found");

    // Check if the user already reviewed this product
    const reviewExists = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.productId, review.productId),
        eq(reviews.userId, review.userId)
      ),
    });

    await db.transaction(async (tx:any) => {
      if (reviewExists) {
        // Update the existing review
        await tx
          .update(reviews)
          .set({
            title: review.title,
            description: review.description,
            rating: review.rating,
          })
          .where(eq(reviews.id, reviewExists.id));
      } else {
        // Insert a new review
        await tx.insert(reviews).values(review);
      }

      // Recalculate the product's average rating and review count
      const [{ avgRating, numReviews }] = await tx
        .select({
          avgRating: avg(reviews.rating),
          numReviews: count(reviews.id),
        })
        .from(reviews)
        .where(eq(reviews.productId, review.productId));

      await tx
        .update(products)
        .set({
          rating: avgRating ?? "0",
          numReviews: numReviews ?? 0,
        })
        .where(eq(products.id, review.productId));
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Review updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}