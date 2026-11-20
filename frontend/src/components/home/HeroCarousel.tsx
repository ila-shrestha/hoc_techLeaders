
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/data/heroSlides";

export function HeroCarousel() {
  const [slides, setSlides] = useState<typeof heroSlides>([]);
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  const count = slides.length;

  // Load images individually instead of waiting for all images.
  useEffect(() => {
    let alive = true;

    heroSlides.forEach((slide) => {
      const img = new Image();

      img.onload = () => {
        if (alive) {
          setSlides((current) => {
            if (current.some((s) => s.src === slide.src)) {
              return current;
            }

            return [...current, slide];
          });
        }
      };

      img.onerror = () => {
        console.warn("Hero image could not be loaded:", slide.src);
      };

      img.src = slide.src;
    });

    return () => {
      alive = false;
    };
  }, []);

  // Move between images.
  const go = useCallback(
    (direction: 1 | -1) => {
      if (count < 2) return;

      setIndex((current) => (current + direction + count) % count);
    },
    [count],
  );

  // Automatically change slides every 2 seconds.
 useEffect(() => {
  if (count < 2) return;

  console.log("Carousel started. Number of slides:", count);

  const interval = window.setInterval(() => {
    setIndex((current) => {
      const next = (current + 1) % count;
      console.log("Changing slide:", current, "to", next);
      return next;
    });
  }, 500);

  return () => window.clearInterval(interval);
}, [count]);

  if (count === 0) return null;

  const single = count === 1;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Ward 16 heritage photographs"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null || single) return;

        const dx = e.changedTouches[0].clientX - touchX.current;

        if (Math.abs(dx) > 40) {
          go(dx < 0 ? 1 : -1);
        }

        touchX.current = null;
      }}
    >
      {/* Sliding image track */}
      <div
        className="flex h-full w-full transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {slides.map((slide) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className="h-full w-full flex-shrink-0 object-cover"
            draggable={false}
          />
        ))}
      </div>

      {!single && (
        <>
          {/* Previous button */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white backdrop-blur transition-colors hover:bg-[#BC0202]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white backdrop-blur transition-colors hover:bg-[#BC0202]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Slide indicators */}
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-5 bg-[#FF0000]"
                    : "w-1.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
