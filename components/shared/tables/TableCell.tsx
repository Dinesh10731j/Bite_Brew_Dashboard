import type { ReactNode } from "react";

export function TableCell({ children }: { children: ReactNode }) {
  return <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-200">{children}</td>;
}
