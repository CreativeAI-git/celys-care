import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightElement, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center">
        {icon && (
          <div className="absolute left-4 pointer-events-none text-purple-300/60 flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-white/10 border border-purple-400/30 rounded-2xl py-3.5 text-white placeholder:text-purple-200/50 text-sm transition-all focus:outline-none focus:border-[#c96ccc] focus:ring-1 focus:ring-[#c96ccc] backdrop-blur-md",
            icon ? "pl-11" : "pl-4",
            rightElement ? "pr-12" : "pr-4",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
