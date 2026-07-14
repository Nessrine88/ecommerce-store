import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import ProdductImages from "@/components/shared/product/product-images";
import ProductPrice from "@/components/shared/product/product-price";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getProductBySlug } from "@/lib/actions/product.actions";
import { Button } from "@base-ui/react";
import AddToCart from "@/components/shared/product/add-to-cart";

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const inStock = product.stock > 0;

  return (
    <section className="min-h-screen py-10 text-accent">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:grid-cols-12">
        {/* Product Image */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-24">
            <ProdductImages images={product.images} />
          </div>
        </div>

        {/* Product Details */}
        <div className="md:col-span-4">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {product.brand} · {product.category}
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {product.name}
              </h1>
            </div>

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
              {product.numReviews === 1 ? "review" : "reviews"}
            </span>
            </div>

            <ProductPrice
              value={Number(product.price)}
              className="w-fit rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700"
            />

            <Separator />

            <div>
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Description
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <ProductPrice
                    value={Number(product.price)}
                    className="text-lg font-semibold"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Status
                  </span>
                  {inStock ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                  <div className="pt-2">
                    {inStock ? (
                      <AddToCart
                        item={{
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          qty: 1,
                          image: product.images[0],
                        }}
                      />
                    ) : (
                      <Button className="w-full" disabled>
                        Out of Stock
                      </Button>
                    )}
                  </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;