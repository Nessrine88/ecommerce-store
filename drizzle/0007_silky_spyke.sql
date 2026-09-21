CREATE TABLE "Category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"createdAt" timestamp (6) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "CategoryTranslation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"categoryId" uuid NOT NULL,
	"locale" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Product" ADD COLUMN "categoryId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_Category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "category_slug_idx" ON "Category" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "category_translation_category_locale_idx" ON "CategoryTranslation" USING btree ("categoryId","locale");--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_Category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Product" DROP COLUMN "category";