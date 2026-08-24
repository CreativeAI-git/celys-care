"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({
  value = 0,
  max = 100,
  className,
}: {
  value?: number;
  max?: number;
  className?: string;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-white/10 border border-purple-400/20",
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-[#c96ccc] to-[#7c3aed] transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default Progress;
