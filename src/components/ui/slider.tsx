"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (val: number) => void;
  className?: string;
}

export function Slider({
  value,
  min = 1,
  max = 5,
  step = 1,
  onValueChange,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center py-2", className)}>
      <div
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-white/10"
        style={{
          border: "1px solid var(--calming-card-border, rgba(180,120,255,0.2))",
        }}
      >
        <div
          className="h-full transition-all"
          style={{
            width: `${percentage}%`,
            background: "var(--calming-toggle-gradient, linear-gradient(to right, #c96ccc, #7c3aed))",
            boxShadow: "0 0 10px var(--calming-accent-glow, rgba(201,108,204,0.3))",
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
      <div
        className="pointer-events-none absolute h-5 w-5 rounded-full border-2 border-white shadow-lg transition-all -translate-x-1/2"
        style={{
          left: `${percentage}%`,
          background: "var(--calming-accent-color, #c96ccc)",
          boxShadow: "0 0 14px var(--calming-accent-glow, rgba(124,58,237,0.5))",
        }}
      />
    </div>
  );
}

export default Slider;
