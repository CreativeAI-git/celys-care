import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "gold" | "outline" | "success";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-purple-600/30 text-purple-200 border-purple-400/30",
    secondary: "bg-white/10 text-white/90 border-white/15",
    gold: "bg-amber-500/20 text-[#f5d76e] border-amber-400/40",
    outline: "border-purple-400/40 text-purple-200",
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors backdrop-blur-sm",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export default Badge;
