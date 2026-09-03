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
        "relative h-2 w-full overflow-hidden rounded-full bg-white/10",
        className
      )}
      style={{
        border: "1px solid var(--calming-card-border, rgba(180,120,255,0.2))",
      }}
    >
      <div
        className="h-full transition-all duration-300 ease-in-out"
        style={{
          width: `${percentage}%`,
          background: "var(--calming-toggle-gradient, linear-gradient(to right, #c96ccc, #7c3aed))",
          boxShadow: "0 0 12px var(--calming-accent-glow, rgba(201,108,204,0.4))",
        }}
      />
    </div>
  );
}

export default Progress;
