"use client";

import * as React from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import useEmblaCarousel from "embla-carousel-react";
import type { UseEmblaCarouselType } from "embla-carousel-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  axis?: "x" | "y";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  carouselApi: ReturnType<typeof useEmblaCarousel>[1];
  thumbsRef: ReturnType<typeof useEmblaCarousel>[0];
  thumbsApi: ReturnType<typeof useEmblaCarousel>[1];
  onThumbClick: (index: number) => void;
  selectedIndex: number;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(({ axis = "x", opts, setApi, plugins, className, children, ...props }, ref) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [carouselRef, carouselApi] = useEmblaCarousel({ ...opts, axis }, plugins);
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    axis,
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const scrollPrev = React.useCallback(() => {
    carouselApi?.scrollPrev();
  }, [carouselApi]);

  const scrollNext = React.useCallback(() => {
    carouselApi?.scrollNext();
  }, [carouselApi]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  const onThumbClick = React.useCallback(
    (index: number) => {
      if (!carouselApi || !thumbsApi) return;
      carouselApi.scrollTo(index);
    },
    [carouselApi, thumbsApi],
  );

  const onSelect = React.useCallback(() => {
    if (!carouselApi) return;
    setSelectedIndex(carouselApi.selectedScrollSnap());
    thumbsApi?.scrollTo(carouselApi.selectedScrollSnap());
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
  }, [setSelectedIndex, thumbsApi, carouselApi]);

  React.useEffect(() => {
    if (!carouselApi || !setApi) return;
    setApi(carouselApi);
  }, [carouselApi, setApi]);

  React.useEffect(() => {
    if (!carouselApi) return;
    onSelect();
    carouselApi.on("reInit", onSelect);
    carouselApi.on("select", onSelect);

    return () => {
      carouselApi?.off("select", onSelect);
    };
  }, [carouselApi, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        carouselApi,
        thumbsRef,
        thumbsApi,
        selectedIndex,
        onThumbClick,
        opts,
        axis: axis || opts?.axis,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        onKeyDownCapture={handleKeyDown}
        className={cn(
          "relative m-auto flex max-w-[48rem] justify-between",
          axis === "x" ? "flex-col" : "",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, thumbsApi, axis } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className={clsx(
        "overflow-hidden",
        thumbsApi
          ? axis === "x"
            ? "basis-[calc(100%-68px)]"
            : "basis-[calc(100%-92px)]"
          : "basis-full",
      )}
    >
      <div
        ref={ref}
        className={cn(
          "flex",
          axis === "x" ? "-ml-4 h-full" : "-mt-4 h-[calc(100%+16px)] flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { axis } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        axis === "x" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselThumbs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { thumbsRef, axis } = useCarousel();

  return (
    <div
      ref={thumbsRef}
      className={clsx("overflow-hidden", axis === "x" ? "basis-[56px]" : "basis-[80px]")}
    >
      <div
        ref={ref}
        className={cn(
          "flex",
          axis === "x" ? "-ml-3" : "-mt-3 h-[calc(100%+16px)] flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselThumbs.displayName = "CarouselThumbs";

const CarouselThumbItem = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & { index: number }
>(({ index, className, children, ...props }, ref) => {
  const { axis, selectedIndex, onThumbClick } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-[22%] sm:basis-[15%]",
        axis === "x" ? "pl-3" : "pt-3",
        className,
      )}
    >
      <button
        ref={ref}
        onClick={() => onThumbClick(index)}
        type="button"
        className={clsx(
          "relative h-full touch-manipulation",
          index === selectedIndex && "[&>img]:opacity-30",
        )}
        {...props}
      >
        {children}
        {index === selectedIndex && (
          <CheckIcon className="absolute inset-[calc(50%-15px)] size-[30px]" />
        )}
      </button>
    </div>
  );
});
CarouselThumbItem.displayName = "CarouselThumbItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { axis, thumbsApi, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full transition duration-300 disabled:hidden",
        axis === "x"
          ? thumbsApi
            ? "left-2 top-[calc(50%-34px)] -translate-y-1/2"
            : "left-2 top-1/2 -translate-y-1/2"
          : thumbsApi
            ? "left-[calc(50%-46px)] top-2 -translate-x-1/2 rotate-90"
            : "left-1/2 top-2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { axis, thumbsApi, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full transition duration-300 disabled:hidden",
        axis === "x"
          ? thumbsApi
            ? "right-2 top-[calc(50%-34px)] -translate-y-1/2"
            : "right-2 top-1/2 -translate-y-1/2"
          : thumbsApi
            ? "bottom-2 left-[calc(50%-46px)] -translate-x-1/2 rotate-90"
            : "bottom-2 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRightIcon className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselThumbs,
  CarouselThumbItem,
};
