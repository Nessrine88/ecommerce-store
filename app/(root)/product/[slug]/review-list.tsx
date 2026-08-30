'use client';

import { Reviews } from "@/types";
import Link from "next/link";
import { useState } from "react";
import { useStackId } from "recharts/types/cartesian/BarStack";

const ReviewList = ({userId, productId, productSlug}:{userId:string; productId:string; productSlug:string;} ) => {
const [reviews, setReviews] = useState<Reviews[]>([]);
    return (
    <div className="space-y-4">
   {reviews.length === 0 && <div>No reviews yet </div>}
   {
    userId ? (<>{/*REVIEW FROM HERE*/} </>) : ( <div>
        Please <Link className="text-sky-500 font-bold px-2" href={`/sign-in?callbackUrl=/product/${productSlug}`}>
        sign in
        </Link>
        to write a review 
    </div>)
   }
    </div>
  )
}

export default ReviewList
