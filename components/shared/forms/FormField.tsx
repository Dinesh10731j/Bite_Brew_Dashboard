import type { ReactNode } from "react";

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-brand-ink dark:text-white">{label}</span>
      {children}
    </label>
  );
}
