"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/shared";

type ModalProps = {
  open: boolean;
  children: ReactNode;
  className?: string;
};

export function Modal({ open, children, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className={cn("w-full max-w-xl rounded-3xl bg-white p-6 shadow-panel dark:bg-[#121b18]", className)}>
        {children}
      </div>
    </div>
  );
}
