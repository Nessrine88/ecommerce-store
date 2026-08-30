CREATE TABLE "Review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	"rating" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"isVerifiedPurchase" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_Product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE cascade ON UPDATE no action;