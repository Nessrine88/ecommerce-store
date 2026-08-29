"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

const ProductCarousel = ({ data }: { data: Product[] }) => {
    console.log(data)
  return (
    <Carousel
      className="w-full my-12 max-w-7xl"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 10000,
          stopOnInteraction: true,
          stopOnMouseEnter:true
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product:Product)=>(
            <CarouselItem>
                <Link href={`/product/${product.slug}`}>
                  <Image
                  src={product.banner!}
                  alt={product.name}
                  height={0}
                  width={0}
                  sizes= '100vw'
                  className="w-full h-auto"
                  />
                  <div className="absolute inset-0 flex items-end justify-center">

                  </div>
                </Link>
            </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ProductCarousel;