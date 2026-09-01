"use client";

import Hero from "@/components/Hero";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
<Carousel
  className="w-full my-12 max-w-7xl"
  opts={{ loop: true }}
  plugins={[
    Autoplay({
      delay: 10000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    }),
  ]}
>
  <CarouselContent>
    {data && data.length > 0 ? (
      data.map((product: Product) => (
        <CarouselItem key={product.id}>
          <Link href={`/product/${product.slug}`}>
            <div className="relative  w-7xl h-[500px] ">
              {product.banner && (
                <Image
                  src={product.banner}
                  alt={product.name}
                  width={1200}
                  height={500}
                  sizes="100vw"
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 flex items-end justify-center">
                {/* Add banner content here */}
              </div>
            </div>
          </Link>
        </CarouselItem>
      ))
    ) : (
      <CarouselItem>
        <Hero />
      </CarouselItem>
    )}
  </CarouselContent>

  <CarouselPrevious />
  <CarouselNext />
</Carousel>
  );
};

export default ProductCarousel;