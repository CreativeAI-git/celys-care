import React from "react";

interface SparkleDividerProps {
  className?: string;
}

export const SparkleDivider: React.FC<SparkleDividerProps> = ({ className = "my-2" }) => {
  return (
    <div className={`flex items-center justify-center gap-2.5 w-full max-w-[180px] mx-auto opacity-75 select-none ${className}`}>
      <div
        className="h-px flex-1"
        style={{
          background: "linear-gradient(to right, transparent, rgba(245, 215, 110, 0.65))",
        }}
      />
      <span style={{ color: "#f5d76e", fontSize: 9, lineHeight: 1 }}>✦</span>
      <div
        className="h-px flex-1"
        style={{
          background: "linear-gradient(to left, transparent, rgba(245, 215, 110, 0.65))",
        }}
      />
    </div>
  );
};

export default SparkleDivider;
