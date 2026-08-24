"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0d0a1e]/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Content Box */}
      <div
        className={cn(
          "relative z-50 w-full max-w-md rounded-3xl p-6 shadow-2xl cosmic-glass border border-purple-400/30 text-white animate-in zoom-in-95 duration-200",
          className
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-1.5 text-purple-200/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 text-left mb-4", className)} {...props} />;
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-xl font-serif font-bold text-[#f0e8ff]", className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-purple-200/70", className)} {...props} />;
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-end space-x-2 pt-4 mt-4 border-t border-purple-400/20", className)} {...props} />;
}

export default Dialog;
