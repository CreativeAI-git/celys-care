"use client";

import React from "react";

export const LotusCorners: React.FC = () => {
  return (
    <>
      {/* Bottom Left Lotus */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 z-0 opacity-70 transition-opacity duration-700"
        aria-hidden="true"
      >
        <svg
          width="180"
          height="140"
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#glowFilter)">
            {/* Background petal */}
            <path
              d="M0 160 C30 110, 80 80, 110 90 C80 120, 50 150, 0 160 Z"
              fill="url(#lotusGrad1)"
              opacity="0.6"
            />
            {/* Center main petal */}
            <path
              d="M0 160 C50 80, 110 50, 140 70 C100 110, 60 140, 0 160 Z"
              fill="url(#lotusGrad2)"
              opacity="0.85"
            />
            {/* Foreground small petal */}
            <path
              d="M0 160 C30 130, 80 120, 95 135 C70 150, 40 155, 0 160 Z"
              fill="url(#lotusGrad3)"
              opacity="0.9"
            />
            {/* Golden stamens */}
            <circle cx="90" cy="85" r="3" fill="#f5d76e" opacity="0.9" />
            <circle cx="115" cy="72" r="3.5" fill="#f5d76e" opacity="0.9" />
            <circle cx="70" cy="105" r="2.5" fill="#f5d76e" opacity="0.8" />
          </g>
          <defs>
            <linearGradient id="lotusGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4c1d95" />
              <stop offset="100%" stopColor="#c96ccc" />
            </linearGradient>
            <linearGradient id="lotusGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="70%" stopColor="#c96ccc" />
              <stop offset="100%" stopColor="#f5d76e" />
            </linearGradient>
            <linearGradient id="lotusGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#e879f9" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Bottom Right Lotus (Mirrored) */}
      <div
        className="pointer-events-none fixed bottom-0 right-0 z-0 opacity-70 transform -scale-x-100 transition-opacity duration-700"
        aria-hidden="true"
      >
        <svg
          width="180"
          height="140"
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#glowFilter)">
            <path
              d="M0 160 C30 110, 80 80, 110 90 C80 120, 50 150, 0 160 Z"
              fill="url(#lotusGrad1)"
              opacity="0.6"
            />
            <path
              d="M0 160 C50 80, 110 50, 140 70 C100 110, 60 140, 0 160 Z"
              fill="url(#lotusGrad2)"
              opacity="0.85"
            />
            <path
              d="M0 160 C30 130, 80 120, 95 135 C70 150, 40 155, 0 160 Z"
              fill="url(#lotusGrad3)"
              opacity="0.9"
            />
            <circle cx="90" cy="85" r="3" fill="#f5d76e" opacity="0.9" />
            <circle cx="115" cy="72" r="3.5" fill="#f5d76e" opacity="0.9" />
            <circle cx="70" cy="105" r="2.5" fill="#f5d76e" opacity="0.8" />
          </g>
        </svg>
      </div>
    </>
  );
};

export default LotusCorners;
