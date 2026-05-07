"use client";

import type { ReactNode } from "react";

type BiteBrewLogoProps = {
  size?: number;
  variant?: "mark" | "full" | "icon";
  className?: string;
};

export function BiteBrewLogo({ size = 28, variant = "full", className }: BiteBrewLogoProps) {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bbg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(32,118,89)" />
          <stop offset="1" stopColor="rgb(26,90,70)" />
        </linearGradient>
      </defs>

      {/* Leaf / coffee steam */}
      <path
        d="M36 8C26 14 20 22 20 32C20 46 31 56 44 56C52 56 58 50 60 42C62 34 57 23 48 16C45 14 41 11 36 8Z"
        fill="url(#bbg)"
        opacity="0.95"
      />

      {/* Bite circle */}
      <circle cx="22" cy="20" r="10" fill="rgb(160,100,96)" opacity="0.25" />
      <circle cx="22" cy="20" r="9" stroke="rgb(32,118,89)" strokeWidth="2" opacity="0.5" />

      {/* Inner steam detail */}
      <path
        d="M38 16C34 20 32 25 32 30C32 39 39 46 47 46"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Small bite notch */}
      <path
        d="M26 18L31 23"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.95"
      />

      {/* Subtle outline */}
      <path
        d="M36 8C26 14 20 22 20 32C20 46 31 56 44 56C52 56 58 50 60 42C62 34 57 23 48 16C45 14 41 11 36 8Z"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
      />
    </svg>
  );

  if (variant === "mark" || variant === "icon") return mark;

  const label = (
    <div className="flex items-center gap-3">
      {mark}
      <div className="leading-tight">
        <p className="text-xs uppercase tracking-[0.3em] text-brand">Bite Brew</p>
        <p className="text-lg font-semibold text-brand-ink dark:text-white">Cafe Console</p>
      </div>
    </div>
  );

  return <>{label as ReactNode}</>;
}


