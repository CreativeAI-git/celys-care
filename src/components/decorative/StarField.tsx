"use client";

import React, { useMemo } from "react";

interface StarFieldProps {
  count?: number;
}

export const StarField: React.FC<StarFieldProps> = ({ count = 40 }) => {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(Math.sin(i * 997) * 49 + 50).toFixed(2)}%`,
      top: `${(Math.cos(i * 613) * 49 + 50).toFixed(2)}%`,
      size: `${(Math.abs(Math.sin(i * 331)) * 2 + 1).toFixed(1)}px`,
      duration: `${(Math.abs(Math.cos(i * 127)) * 3 + 2).toFixed(1)}s`,
      delay: `${(Math.abs(Math.sin(i * 881)) * 3).toFixed(1)}s`,
      opacity: (Math.abs(Math.sin(i * 443)) * 0.7 + 0.3).toFixed(2),
    }));
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `twinkle ${s.duration} ease-in-out infinite`,
            animationDelay: s.delay,
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.8)",
          }}
        />
      ))}
    </div>
  );
};

export default StarField;
