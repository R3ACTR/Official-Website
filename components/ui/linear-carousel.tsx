"use client";

import React from "react";
import Image from "next/image";

const images = [
  "/Images/1.jpeg",
  "/Images/2.jpeg",
  "/Images/3.jpeg",
  "/Images/4.jpeg",
  "/Images/5.jpeg",
  "/Images/6.jpeg",
  "/Images/7.jpeg",
  "/Images/8.jpeg",
];

export function LinearCarousel() {
  // Duplicate the array to create a seamless infinite loop
  const scrollImages = [...images, ...images];

  return (
    <div className="relative w-full overflow-hidden my-4 md:my-8 z-30 pointer-events-auto group">
      <div 
        className="flex gap-4 md:gap-6 w-max"
        style={{
          animation: "marquee 35s linear infinite"
        }}
      >
        {scrollImages.map((src, i) => (
          <div
            key={i}
            className="relative w-[160px] sm:w-[200px] md:w-[260px] h-[180px] sm:h-[240px] md:h-[300px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/20 bg-white/5 transition-transform duration-300 hover:scale-[1.03]"
          >
            <Image
              src={src}
              alt={`Carousel Image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 200px, 260px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); } /* -50% + half of the gap spacing (gap-6 = 24px) */
        }
        
        /* Pause animation on hover */
        .group:hover > div {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
