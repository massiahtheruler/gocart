"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { categories } from "@/assets/assets";

const CategoriesMarquee = () => {
  const marqueeItems = [...categories, ...categories];
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const animationFrameRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0.4);
  const targetVelocityRef = useRef(0.4);

  useEffect(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    const wrapOffset = (value, width) => {
      if (width <= 0) return 0;
      return ((value % width) + width) % width;
    };

    const step = () => {
      const loopWidth = track.scrollWidth / 2;
      velocityRef.current +=
        (targetVelocityRef.current - velocityRef.current) * 0.08;
      offsetRef.current = wrapOffset(
        offsetRef.current + velocityRef.current,
        loopWidth,
      );
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;

      targetVelocityRef.current += (0.4 - targetVelocityRef.current) * 0.035;
      animationFrameRef.current = window.requestAnimationFrame(step);
    };

    const handleNativeWheel = (event) => {
      event.preventDefault();

      const dominantDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      targetVelocityRef.current = Math.max(
        -10.2,
        Math.min(20.2, targetVelocityRef.current + dominantDelta * 0.448),
      );
    };

    wrapper.addEventListener("wheel", handleNativeWheel, { passive: false });
    animationFrameRef.current = window.requestAnimationFrame(step);

    return () => {
      wrapper.removeEventListener("wheel", handleNativeWheel);
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="group relative mx-auto w-full max-w-7xl select-none overflow-hidden sm:my-20">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white via-white/90 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-[10%] w-48 rounded-full bg-emerald-200/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-y-0 right-[12%] w-56 rounded-full bg-sky-200/20 blur-3xl" />

      <div ref={wrapperRef} className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max gap-4 py-1 will-change-transform"
        >
          {marqueeItems.map((company, index) => (
            <Link
              href={`/shop?category=${encodeURIComponent(company)}`}
              key={`${company}-${index}`}
              className="marquee-chip glass-sheen shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold tracking-[0.02em] text-slate-700 sm:px-6 sm:py-3 sm:text-sm"
              aria-hidden={index >= categories.length}
              tabIndex={index >= categories.length ? -1 : 0}
            >
              {company}
            </Link>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white via-white/90 to-transparent md:w-40" />
    </div>
  );
};

export default CategoriesMarquee;
