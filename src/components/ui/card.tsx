import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cosmic-glass rounded-2xl p-5 text-white transition-all",
        onClick && "cursor-pointer hover:border-purple-400/50 hover:bg-white/[0.08] active:scale-[0.99]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 pb-3", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold leading-none tracking-tight text-[#f0e8ff]", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-purple-200/70 pt-1", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center pt-3 border-t border-purple-400/15", className)} {...props} />;
}

export default Card;
