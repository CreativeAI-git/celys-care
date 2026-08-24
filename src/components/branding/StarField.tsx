import React, { useMemo } from "react";

export const StarField: React.FC<{ count?: number }> = ({ count = 50 }) => {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: ((i * 37 + 13) % 100).toFixed(2),
      left: ((i * 73 + 29) % 100).toFixed(2),
      size: (1 + ((i * 19) % 3) * 0.8).toFixed(1),
      opacity: (0.25 + ((i * 11) % 5) * 0.15).toFixed(2),
      delay: (((i * 7) % 4) * 0.7).toFixed(1),
      duration: (2.5 + ((i * 5) % 3) * 0.8).toFixed(1),
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: parseFloat(s.opacity),
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default StarField;
