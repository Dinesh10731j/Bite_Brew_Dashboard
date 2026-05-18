"use client";

import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/shared";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 dark:border-white/10 dark:bg-white/5 dark:text-white",
        props.className
      )}
    />
  );
}
