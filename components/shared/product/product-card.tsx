import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="border border-accent">
      <CardHeader>
        <Link href={`/product/${product.slug}`}>
          <div className="h-64 rounded-sm border border-accent overflow-hidden">
            <Image
              src={product.images[0]}
              width={500}
              height={500}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </CardHeader>

      <CardContent className="grid gap-4 p-4">
        <div>{product.brand}</div>

        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">
            {product.name}
          </h2>
        </Link>

        <div className="flex-between gap-4">
          <p>{product.rating} Stars</p>

          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="font-bold text-red-300">
              Out Of Stock
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;