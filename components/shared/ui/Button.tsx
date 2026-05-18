"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/shared";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
        variant === "primary" &&
          "bg-brand text-white hover:bg-brand-deep dark:bg-brand dark:hover:bg-brand/90",
        variant === "secondary" &&
          "bg-brand-soft text-brand-ink hover:bg-brand-soft/80 dark:bg-white/10 dark:text-white",
        variant === "danger" && "bg-rose-500 text-white hover:bg-rose-600",
        className
      )}
      {...props}
    />
  );
}
