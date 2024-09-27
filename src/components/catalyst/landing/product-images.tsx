"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
} from "@/components/ui/carousel";

import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import AutoplayPlugin from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SquigglySeparator } from "../squiggly-separator";

export function ProductImageCarousel() {
  return (
    <Carousel
      opts={{
        loop: true,
        align: "center",
      }}
      plugins={[WheelGesturesPlugin(), AutoplayPlugin()]}
    >
      <CarouselPictures />
    </Carousel>
  );
}

function CarouselPictures() {
  const { api } = useCarousel();
  const [page, setPage] = useState(0);
  const pages = useRef([
    {
      title: "Dashboard",
      description:
        "A dashboard to easily manage courses, assignments, and grades.",
      image: "/images/dashboard.png",
    },
    {
      title: "Courses",
      description: "Easily view and find your course",
      image: "/images/courses.png",
    },
    {
      title: "Grades",
      description: "Easily view and preview grades.",
      image: "/images/grades.png",
    },
    {
      title: "Messaging",
      description: "Easily communicate with your teachers and classmates.",
      image: "/images/inbox.png",
    },
  ]);

  useEffect(() => {
    const onSelect = () => {
      setPage(api?.selectedScrollSnap() ?? 0);
    };

    api
      ?.on("select", onSelect)
      ?.on("init", onSelect)
      ?.on("reInit", onSelect)
      .on("slidesChanged", onSelect);
  }, [api]);

  return (
    <>
      <CarouselContent className="w-[min(calc(100vw-4rem),60ch)] rounded-lg lg:w-[min(calc(50vw-4rem),30rem)]">
        {pages.current.map((page, idx) => (
          <CarouselItem key={idx} className="h-full max-w-full">
            <div className="flex max-w-full flex-col gap-2">
              <Image
                src={page.image}
                width={400}
                height={400}
                alt={page.title}
                className="aspect-video w-full rounded-lg border object-cover"
              />
              <SquigglySeparator waveColor="hsl(var(--muted))" waveWidth={20} />
              <div>
                <p className="text-sm font-bold">{page.title}</p>
                <p className="text-xs">{page.description}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex gap-2">
          <CarouselPrevious className="size-auto rounded-full p-2" />
          <CarouselNext className="size-auto rounded-full p-2" />
        </div>
        <div className="flex gap-2">
          {pages.current.map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={cn(
                "h-2 w-4 rounded-full bg-secondary transition-all",
                {
                  "w-8 bg-primary": idx == page,
                },
              )}
            >
              <span className="sr-only">{`Go to page ${idx + 1}`}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
