"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/shared";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/10 dark:border-white/10 dark:bg-white/5 dark:text-white",
        props.className
      )}
    />
  );
}
