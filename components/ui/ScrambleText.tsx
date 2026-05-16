"use client";

import { useState, useEffect, useRef } from "react";

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________";

export default function ScrambleText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let loopTimeout: NodeJS.Timeout;
    
    const scramble = () => {
      let iteration = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(() => {
        setDisplayText((prev) => 
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              // Preserve spaces
              if (letter === " ") return " ";
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        
        if (iteration >= text.length) {
          clearInterval(intervalRef.current!);
        }
        
        iteration += 1 / 3; // Controls speed of resolution
      }, 30);
    };

    const startLoop = () => {
      scramble();
      loopTimeout = setTimeout(startLoop, 4000 + Math.random() * 2000);
    };

    startLoop();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(loopTimeout);
    };
  }, [text]);

  return (
    <span className="font-mono font-bold text-white tracking-wider px-1 bg-white/5 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.1)] inline-block transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-default">
      {displayText}
    </span>
  );
}
