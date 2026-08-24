"use client";

import React from "react";

interface LionLogoProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
}

export const LionLogo: React.FC<LionLogoProps> = ({
  size = 72,
  className = "",
  showGlow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Top Star Accent */}
      <span
        className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-xs select-none z-10 animate-pulse"
        style={{ color: "#f5d76e", fontSize: Math.max(10, size * 0.16) }}
      >
        ✦
      </span>

      {/* Outer Ring with Glow */}
      <div
        className="relative flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: "100%",
          height: "100%",
          border: "2px solid #c9a227",
          background: "radial-gradient(circle, rgba(201, 162, 39, 0.25) 0%, rgba(13, 10, 30, 0.8) 85%)",
          boxShadow: showGlow
            ? "0 0 25px rgba(201, 162, 39, 0.45), inset 0 0 15px rgba(245, 215, 110, 0.3)"
            : "none",
        }}
      >
        {/* Lion Crest SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-3/4 h-3/4 drop-shadow-[0_2px_8px_rgba(201,162,39,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Sun Mane Rays */}
          <path
            d="M50 12 L53 22 L62 16 L60 26 L71 23 L65 32 L77 32 L68 40 L79 43 L68 49 L78 55 L66 59 L74 67 L62 67 L67 78 L56 74 L57 86 L49 79 L43 86 L44 74 L33 78 L38 67 L26 67 L34 59 L22 55 L32 49 L21 43 L32 40 L23 32 L35 32 L29 23 L40 26 L38 16 L47 22 Z"
            fill="url(#goldMane)"
            opacity="0.85"
          />

          {/* Lion Face Crown & Head */}
          <path
            d="M36 38 Q50 30 64 38 Q67 52 50 68 Q33 52 36 38 Z"
            fill="url(#goldFace)"
          />

          {/* Crown Peak */}
          <path
            d="M42 34 L50 25 L58 34 L54 36 L50 32 L46 36 Z"
            fill="#fff"
            opacity="0.8"
          />

          {/* Eyes */}
          <ellipse cx="44" cy="45" rx="2.5" ry="1.5" fill="#0d0a1e" />
          <ellipse cx="56" cy="45" rx="2.5" ry="1.5" fill="#0d0a1e" />

          {/* Snout & Nose */}
          <path
            d="M48 51 L52 51 L50 54 Z"
            fill="#0d0a1e"
          />
          <path
            d="M50 54 Q46 59 42 57 M50 54 Q54 59 58 57"
            stroke="#0d0a1e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="goldMane" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5d76e" />
              <stop offset="50%" stopColor="#c9a227" />
              <stop offset="100%" stopColor="#8a6b10" />
            </linearGradient>
            <linearGradient id="goldFace" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff2a3" />
              <stop offset="60%" stopColor="#e6c65c" />
              <stop offset="100%" stopColor="#c9a227" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default LionLogo;
