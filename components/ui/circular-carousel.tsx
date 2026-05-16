"use client";

import React, { useState, useEffect, useRef } from "react";
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

export function CircularCarousel() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [radius, setRadius] = useState(280);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const directionRef = useRef<number>(1);
  const dragSpeed = 0.5;
  const autoRotateSpeed = 0.15; // degrees per frame
  const maxRotation = 90; // Hemisphere bounds (-90 to +90)

  // Handle responsive radius for massive semi-circle arch
  useEffect(() => {
    const updateRadius = () => {
      // Scale radius dynamically based on screen width to create a full-width semi-circle
      setRadius(Math.max(window.innerWidth * 0.65, 260));
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  // Auto rotation animation with bounce
  useEffect(() => {
    if (isDragging) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current != null) {
        setRotation((prev) => {
          let next = prev + autoRotateSpeed * directionRef.current;
          if (next >= maxRotation) {
            next = maxRotation;
            directionRef.current = -1;
          } else if (next <= -maxRotation) {
            next = -maxRotation;
            directionRef.current = 1;
          }
          return next;
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isDragging]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.pageX - startX;
    setRotation((prev) => Math.max(-maxRotation, Math.min(maxRotation, prev + delta * dragSpeed)));
    setStartX(e.pageX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].pageX - startX;
    setRotation((prev) => Math.max(-maxRotation, Math.min(maxRotation, prev + delta * dragSpeed)));
    setStartX(e.touches[0].pageX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] flex items-center justify-center pointer-events-auto my-4 md:my-8 select-none overflow-visible z-30"
      style={{ perspective: "2000px" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="relative w-[120px] sm:w-[160px] md:w-[200px] h-[160px] sm:h-[200px] md:h-[260px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          transformStyle: "preserve-3d",
          transform: `translateZ(${-radius}px) rotateY(${rotation}deg)`,
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        {images.map((src, i) => {
          // Distribute 8 images across a 180 degree hemisphere (-90 to +90)
          const angle = -90 + i * (180 / (images.length - 1));
          return (
            <div
              key={src}
              className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/40 backdrop-blur-md bg-white/10 group hover:border-white/80 transition-all duration-300"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                WebkitBoxReflect: "below 5px linear-gradient(transparent, transparent, rgba(0,0,0,0.2))",
              }}
            >
              <Image
                src={src}
                alt={`Carousel Image ${i + 1}`}
                fill
                sizes="(max-width: 768px) 160px, 200px"
                className="object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>
      
      {/* Interactive prompt */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-black/60 font-semibold tracking-widest uppercase pointer-events-none bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/30 shadow-sm">
        ← Drag to Rotate →
      </div>
    </div>
  );
}
