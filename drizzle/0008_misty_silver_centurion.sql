CREATE TABLE "NewsletterSubscriber" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"isSubscribed" boolean DEFAULT true NOT NULL,
	"subscribedAt" timestamp DEFAULT now() NOT NULL,
	"unsubscribedAt" timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX "NewsletterSubscriber_email_unique" ON "NewsletterSubscriber" USING btree ("email");