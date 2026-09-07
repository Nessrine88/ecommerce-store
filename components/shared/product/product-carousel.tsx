
"use client";

import Hero from "@/components/Hero";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
    <Carousel
      className="w-full  mx-auto my-6 sm:my-8 md:my-12 px-2 sm:px-4"
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
              <Link
                href={`/product/${product.slug}`}
                className="block"
              >
                <div
                  className="
                    relative
                    w-full
                    h-[200px]
                    xs:h-[250px]
                    sm:h-[300px]
                    md:h-[400px]
                    lg:h-[500px]
                    overflow-hidden
                    rounded-md
                  "
                >
                  {product.banner && (
                    <Image
                      src={product.banner}
                      alt={product.name}
                      fill
                      sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 100vw,
                        1200px
                      "
                      className="object-cover"
                      priority
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

      <CarouselPrevious className="left-2 sm:left-4" />
      <CarouselNext className="right-2 sm:right-4" />
    </Carousel>
  );
};

export default ProductCarousel;

