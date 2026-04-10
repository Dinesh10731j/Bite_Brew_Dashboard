import type { ReactNode } from "react";

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="border-b border-brand/10 last:border-b-0 dark:border-white/10">{children}</tr>;
}
