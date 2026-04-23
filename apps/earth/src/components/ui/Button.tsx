import * as React from "react";
import { cn } from "@kilimo/utils";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-4";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-input bg-background hover:bg-muted hover:text-foreground",
    ghost: "hover:bg-muted hover:text-foreground",
  };
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
});
Button.displayName = "Button";
