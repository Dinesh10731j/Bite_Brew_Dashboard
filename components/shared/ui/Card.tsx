"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/shared";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/60 bg-white/80 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1714]/80",
        className
      )}
    >
      {children}
    </div>
  );
}
