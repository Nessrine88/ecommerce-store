"use client";

import { Reviews } from "@/types";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";
import ReviewForm from "./review-form";
import { getReviews } from "@/lib/actions/review.action";
import { formatDateTime } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    const res = await getReviews({ productId });
    setReviews(res.data);
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const reload = () => {
    loadReviews();
  };

  return (
    <div className="space-y-4">
      {loading && reviews.length === 0 && <div>Loading reviews...</div>}

      {!loading && reviews.length === 0 && <div>No reviews yet</div>}

      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div>
          Please{" "}
          <Link
            className="px-2 font-bold text-sky-500"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>
          to write a review
        </div>
      )}

      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id} className="rounded-lg border p-4 my-5">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="font-semibold">{review.title}</CardTitle>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < review.rating
                        ? "h-4 w-4 fill-accent text-accent"
                        : "h-4 w-4 text-muted/30"
                    }
                  />
                ))}
              </div>
            </CardHeader>

            <p className="mt-2 text-sm text-muted">{review.description}</p>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted">
              <span>{review.user?.name ?? "Anonymous"}</span>
              <span>·</span>
              <span>{formatDateTime(review.createdAt).datetime}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;