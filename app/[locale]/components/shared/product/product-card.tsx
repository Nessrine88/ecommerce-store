"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Link } from "@/navigation";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import { useTranslations } from "next-intl";

const shapes = [
  "aspect-[4/5]",
  "aspect-[4/5.8]",
  "aspect-[4/5]",
  "aspect-[4/5]",
  "aspect-[4/7.2]",
  "aspect-[4/5]",
];

const ProductCard = ({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) => {
  const t = useTranslations("ProductCard");

  // stagger: left to right, then the second row slightly later
  const delay = (index % 3) * 0.12 + Math.floor(index / 3) * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group flex w-full flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-[#3a7a58] to-[#1f4d38] shadow-xl shadow-black/30 ring-1 ring-white/10"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className={`relative w-full ${shapes[index % shapes.length]}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-6 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="flex flex-col items-center gap-1 bg-black/15 px-3 py-3 text-center">
        <Link href={`/product/${product.slug}`}>
          <h2 className="line-clamp-1 text-xs font-medium text-white">
            {product.name}
          </h2>
        </Link>

        <div className="flex items-center gap-3 text-[11px] text-white/70">
          <span>
            {product.rating} {t("stars")}
          </span>

          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <span className="font-bold text-red-300">Out Of Stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;