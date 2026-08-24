import React from "react";

export const LotusCorners: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`pointer-events-none ${className}`}>
      {/* Bottom Left Lotus */}
      <div className="fixed bottom-0 left-0 pointer-events-none opacity-70 z-0">
        <svg viewBox="0 0 140 180" width="130" height="160" fill="none">
          <defs>
            <radialGradient id="lc1" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#c96ccc" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#3b1f7a" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          <path d="M80 170 Q30 110 40 50 Q60 90 80 110Z" fill="url(#lc1)" />
          <path d="M80 170 Q10 140 20 80 Q50 120 80 130Z" fill="url(#lc1)" />
          <path d="M80 170 Q55 100 60 40 Q75 90 80 120Z" fill="#c96ccc" opacity="0.6" />
          <path d="M80 170 Q25 130 30 70 Q60 110 80 140Z" fill="#9333ea" opacity="0.45" />
        </svg>
      </div>

      {/* Bottom Right Lotus (mirrored) */}
      <div
        className="fixed bottom-0 right-0 pointer-events-none opacity-70 z-0"
        style={{ transform: "scaleX(-1)" }}
      >
        <svg viewBox="0 0 140 180" width="130" height="160" fill="none">
          <defs>
            <radialGradient id="lc2" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#c96ccc" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#3b1f7a" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          <path d="M80 170 Q30 110 40 50 Q60 90 80 110Z" fill="url(#lc2)" />
          <path d="M80 170 Q10 140 20 80 Q50 120 80 130Z" fill="url(#lc2)" />
          <path d="M80 170 Q55 100 60 40 Q75 90 80 120Z" fill="#c96ccc" opacity="0.6" />
          <path d="M80 170 Q25 130 30 70 Q60 110 80 140Z" fill="#9333ea" opacity="0.45" />
        </svg>
      </div>
    </div>
  );
};

export default LotusCorners;
