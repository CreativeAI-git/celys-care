/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

interface CelysLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const CelysLogo: React.FC<CelysLogoProps> = ({
  size = 80,
  className = "",
  showText = false,
}) => {
  const [imgSrc, setImgSrc] = useState("/images/profile.jpg");

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient gold-violet glow */}
      <div
        className="absolute rounded-full pointer-events-none -z-10 blur-sm"
        style={{
          width: size * 1.2,
          height: size * 1.2,
          background:
            "radial-gradient(circle, rgba(201,162,39,0.3) 0%, rgba(124,58,237,0.15) 55%, transparent 70%)",
        }}
      />

      {/* Circular Emblem with concentric gold border and shadow */}
      <div
        className="relative overflow-hidden rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300 flex-shrink-0"
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
          boxShadow:
            "0 0 30px rgba(201,162,39,0.6), 0 0 12px rgba(201,162,39,0.35), inset 0 0 0 2px rgba(245,215,110,0.8)",
          background: "radial-gradient(circle at 35% 35%, #2a114f 0%, #0d0a1e 90%)",
          borderRadius: "50%",
        }}
      >
        <img
          src={imgSrc}
          alt="Celys Care Celestial Emblem"
          width={size}
          height={size}
          onError={() => {
            if (imgSrc !== "/images/lion-emblem-hq1.jpg") {
              setImgSrc("/images/lion-emblem-hq1.jpg");
            }
          }}
          className="w-full h-full object-cover object-center rounded-full block pointer-events-none select-none flex-shrink-0"
          style={{ width: size, height: size, minWidth: size, minHeight: size, aspectRatio: "1/1" }}
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col items-center mt-2">
          <span
            className="font-serif font-bold text-lg tracking-wider"
            style={{
              background: "linear-gradient(135deg, #f5d76e 0%, #c9a227 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Celys Care
          </span>
          <span className="text-[10px] tracking-[0.2em] text-[#f5d76e]/70 uppercase">
            ✦ Wellness Companion ✦
          </span>
        </div>
      )}
    </div>
  );
};

export default CelysLogo;

