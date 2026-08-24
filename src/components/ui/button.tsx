import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "destructive";
  size?: "sm" | "md" | "lg" | "icon" | "pill";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "purple-gradient-btn text-white shadow-lg shadow-purple-900/30 border border-purple-400/30",
      secondary:
        "bg-white/10 text-[#f0e8ff] hover:bg-white/15 border border-purple-400/20 backdrop-blur-md",
      outline:
        "border border-purple-400/40 text-purple-200 hover:bg-purple-500/10 hover:border-purple-400/70",
      ghost: "text-purple-200 hover:bg-white/10 hover:text-white",
      gold: "bg-gradient-to-r from-[#d4a017] to-[#f5d76e] text-[#0d0a1e] font-semibold hover:brightness-110 shadow-lg shadow-amber-900/30",
      destructive:
        "bg-red-600/80 text-white hover:bg-red-600 border border-red-500/40",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-xl gap-1.5",
      md: "h-11 px-5 text-sm rounded-2xl gap-2",
      lg: "h-13 px-7 text-base rounded-2xl gap-2.5 font-semibold",
      pill: "h-12 px-8 text-sm rounded-full gap-2 font-semibold shadow-md",
      icon: "h-10 w-10 rounded-full flex items-center justify-center p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
