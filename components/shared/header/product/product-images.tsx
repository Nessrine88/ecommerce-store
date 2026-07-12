"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ProdductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex flex-col gap-4">
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Product Details
        </h2>
      <div className="overflow-hidden rounded-lg border bg-muted/20">
        <Image
          src={images[current]}
          alt="Product image"
          width={1000}
          height={1000}
          priority
          className="aspect-square w-full object-cover object-center"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Show image ${index + 1}`}
            aria-current={current === index}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border transition",
              current === index
                ? "border-foreground ring-2 ring-foreground ring-offset-2"
                : "border-transparent opacity-70 hover:opacity-100"
            )}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={160}
              height={160}
              className="h-full w-full object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProdductImages;