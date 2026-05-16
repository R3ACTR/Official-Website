"use client";

import { useState } from "react";
import { Orbitron } from "next/font/google";
import { X, Menu } from "lucide-react";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["900"] });

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <nav className="animate-fade-blur delay-1 flex md:hidden absolute top-0 left-0 right-0 z-[100] items-center justify-between px-5 py-4 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_24px_0_rgba(31,38,135,0.07)] text-slate-800">
        <div className={`${orbitron.className} font-black text-lg tracking-widest mix-blend-color-burn`}>
          R3ACTR
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 active:scale-95 transition-transform"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
        </button>
      </nav>

      {/* Full-screen menu */}
      <div
        className={`fixed inset-0 z-[99] md:hidden transition-opacity duration-300 ease-in-out transform-gpu will-change-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Full-screen backdrop */}
        <div
          className="absolute inset-0 bg-white/40 backdrop-blur-2xl"
          style={{ WebkitBackdropFilter: "blur(40px)" }}
          onClick={() => setOpen(false)}
        />
        {/* Menu panel */}
        <div className="relative h-full flex flex-col items-center justify-center gap-8 px-6 pt-16">
          {["Home", "Features", "Pricing", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              onClick={() => setOpen(false)}
              className="text-slate-800 font-bold text-3xl tracking-wider hover:opacity-60 transition-opacity"
            >
              {item}
            </a>
          ))}
          <button className="mt-8 w-full max-w-xs bg-white/40 hover:bg-white/60 backdrop-blur-md py-4 rounded-full text-lg font-bold transition-all border border-white/30 shadow-sm">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
