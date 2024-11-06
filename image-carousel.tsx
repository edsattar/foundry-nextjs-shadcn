"use client";

import * as React from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbItem,
  CarouselThumbs,
} from "./carousel";
import { cn } from "~/lib/utils";

export function ImageCarousel({
  data,
  albumName,
  className,
  withThumbs = false,
  axis = "x",
}: {
  data: {
    images: {
      height: number;
      source: string;
      width: number;
    }[];
  }[];
  albumName: string;
  className?: string;
  withThumbs?: boolean;
  axis?: "x" | "y";
}) {
  return (
    <Carousel
      opts={{ align: "start" }}
      className={cn("group h-[396px] w-[680px]", className)}
      axis={axis}
    >
      <CarouselContent>
        {data.map((collection, index) => {
          const img = collection.images[1];
          return (
            <CarouselItem key={index}>
              <Image
                src={img.source}
                alt={`${albumName} ${index + 1}`}
                width={img.width}
                height={img.height}
                className="h-full object-cover"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {withThumbs && (
        <CarouselThumbs>
          {data.map((collection, index) => {
            const img = collection.images[7];
            return (
              <CarouselThumbItem key={index} index={index}>
                <Image
                  src={img.source}
                  alt={`${albumName} ${index + 1}`}
                  width={img.width}
                  height={img.height}
                  className="h-full object-cover transition-all hover:scale-105"
                />
              </CarouselThumbItem>
            );
          })}
        </CarouselThumbs>
      )}
      <CarouselPrevious className="opacity-0 group-hover:opacity-100" />
      <CarouselNext className="opacity-0 group-hover:opacity-100" />
    </Carousel>
  );
}
