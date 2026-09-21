
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Star } from "lucide-react";

import ProductImages from "@/app/[locale]/components/shared/product/product-images";
import ProductPrice from "@/app/[locale]/components/shared/product/product-price";
import AddToCart from "@/app/[locale]/components/shared/product/add-to-cart";

import { Badge } from "@/app/[locale]/components/ui/badge";
import { Card, CardContent } from "@/app/[locale]/components/ui/card";
import { Separator } from "@/app/[locale]/components/ui/separator";

import { getProductBySlug } from "@/lib/actions/product.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import { auth } from "@/auth";

import ReviewList from "./review-list";

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) => {
  const { locale, slug } = await params;

  const t = await getTranslations({
    locale,
    namespace: "ProductPage",
  });

  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;

  const inStock = product.stock > 0;

  const cart = await getMyCart();

  const normalizedCart = cart
    ? {
        ...cart,
        items: (cart.items ?? []) as {
          productId: string;
          name: string;
          slug: string;
          qty: number;
          image: string;
          price: string;
        }[],
      }
    : undefined;

  return (
    <div className="mx-auto flex max-w-7xl flex-col">
      <section className="min-h-screen py-10 text-accent">
        <div className="mx-auto grid grid-cols-1 gap-10 px-4 md:grid-cols-12">
          {/* Product Image */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-24">
              <ProductImages images={product.images ?? []} />
            </div>
          </div>

          {/* Product Details */}
          <div className="md:col-span-4">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {product.brand} · {product.categoryId}
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(Number(product.rating))
                          ? "h-4 w-4 fill-yellow-400 text-yellow-400"
                          : "h-4 w-4 text-muted-foreground/30"
                      }
                    />
                  ))}
                </div>

                <span>
                  {Number(product.rating)} · {product.numReviews}{" "}
                  {product.numReviews === 1
                    ? t("review")
                    : t("reviews")}
                </span>
              </div>

              {/* Product Price */}
              <ProductPrice
                value={Number(product.price)}
                className="w-fit rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700"
              />

              <Separator />

              {/* Description */}
              <div>
                <h2 className="mb-2 text-sm font-semibold text-foreground">
                  {t("description")}
                </h2>

                <p className="leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Purchase Card */}
          <div className="md:col-span-3">
            <div className="md:sticky md:top-24">
              <Card>
                <CardContent className="space-y-5 p-5">
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("price")}
                    </span>

                    <ProductPrice
                      value={Number(product.price)}
                      className="text-lg font-semibold"
                    />
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("status")}
                    </span>

                    {inStock ? (
                      <Badge variant="outline">
                        {t("stock")}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        {t("notStock")}
                      </Badge>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <div className="pt-2">
                    {inStock ? (
                      <AddToCart
                        cart={normalizedCart}
                        item={{
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          qty: 1,
                          image: product.images?.[0] ?? "",
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        className="w-full rounded-md bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
                        disabled
                      >
                        {t("notStock")}
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="h-full w-full py-8 text-accent">
        <h2 className="font-bold">
           {t("details.customerReviews")}
        </h2>

        <ReviewList
          userId={userId || ""}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </div>
  );
};

export default ProductDetailsPage;

