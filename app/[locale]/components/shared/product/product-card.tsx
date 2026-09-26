"use client";

import { Card, CardContent, CardHeader } from "@/app/[locale]/components/ui/card";
import Image from "next/image";
import { Link } from "@/navigation";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {



  return (
    <Card className=" border-accent border  bg-gradient-to-b from-[#062514] via-[#128b46]  to-[#012611] shadow-2xl shadow-bg">
      <CardHeader>
        <Link href={`/product/${product.slug}`}>
          <div className="h-53 overflow-hidden rounded-sm shadow-bg shadow-2xl">
            <Image
              src={product.images[0]}
              width={500}
              height={500}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      </CardHeader>

      <CardContent className="grid gap-4 p-4 bg-gradient px-4 drop-shadow-xl/50  rounded-xl ">

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