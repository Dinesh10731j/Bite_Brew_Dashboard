"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
    >
      {mode === "light" ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
      {mode === "light" ? "Dark" : "Light"} mode
    </button>
  );
}
