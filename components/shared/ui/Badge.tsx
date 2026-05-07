"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
  className?: string;
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
        tone === "success" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
        tone === "warning" && "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",

        tone === "danger" && "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
        tone === "brand" && "bg-brand-soft text-brand-ink dark:bg-brand/20 dark:text-emerald-200",
        className
      )}
    >
      {children}
    </span>
  );
}

