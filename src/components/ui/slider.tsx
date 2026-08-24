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
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-white/10 border border-purple-400/20">
        <div
          className="h-full bg-gradient-to-r from-[#c96ccc] to-[#7c3aed] transition-all"
          style={{ width: `${percentage}%` }}
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
        className="pointer-events-none absolute h-5 w-5 rounded-full border-2 border-white bg-[#c96ccc] shadow-lg shadow-purple-900/50 transition-all -translate-x-1/2"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
}

export default Slider;
