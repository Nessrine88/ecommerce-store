"use client";

import Hero from "@/app/[locale]/components/Hero";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/[locale]/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Link } from "@/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
    <Carousel
      className="w-full max-w-7xl mx-auto px-2 sm:px-4"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 7000,
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
                className="group block relative"
              >
                <div
                  className="
                    relative
                    w-full
                    h-[300px]
                    xs:h-[340px]
                    sm:h-[420px]
                    md:h-[500px]
                    lg:h-[560px]
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    shadow-2xl
                  "
                >
                  {/* Background Image */}
                  {product.banner && (
                    <Image
                      src={product.banner}
                      alt={product.name}
                      fill
                      sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 100vw,
                        1280px
                      "
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority
                    />
                  )}

                  {/* Cinematic Dark Gradient Layers for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/85 sm:via-black/35 sm:to-transparent" />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-6 sm:p-10 md:p-14 text-white">
                    <div className="max-w-xl space-y-3 sm:space-y-4">
                      {/* Pill Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/40 backdrop-blur-md text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        Featured Collection
                      </div>

                      {/* Product Headline */}
                      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-sm">
                        {product.name}
                      </h2>

                      {/* Subtitle / Description */}
                      <p className="text-xs sm:text-sm md:text-base text-zinc-300 line-clamp-2 max-w-md font-normal leading-relaxed">
                        {product.description ||
                          "Bring nature closer with fresh, hand-picked indoor flora tailored to your living space."}
                      </p>

                      {/* Price Tag & CTA Button */}
                      <div className="pt-2 flex flex-wrap items-center gap-4">
                        {product.price && (
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                            ${product.price}
                          </div>
                        )}

                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-400 text-zinc-950 text-xs sm:text-sm font-bold shadow-lg transition-all duration-300 group-hover:bg-emerald-300 group-hover:gap-3">
                          Shop Now
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
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

      <CarouselPrevious className="left-3 sm:left-6 bg-black/40 hover:bg-black/70 text-white border-white/20 backdrop-blur-md w-10 h-10 transition-all" />
      <CarouselNext className="right-3 sm:right-6 bg-black/40 hover:bg-black/70 text-white border-white/20 backdrop-blur-md w-10 h-10 transition-all" />
    </Carousel>
  );
};

export default ProductCarousel;