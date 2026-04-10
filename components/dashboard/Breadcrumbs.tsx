"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
      <Link href="/dashboard" className="font-medium text-brand">
        Dashboard
      </Link>
      {parts.slice(1).map((part, index) => {
        const href = `/${parts.slice(0, index + 2).join("/")}`;
        const label = part.replace(/-/g, " ");

        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            <Link href={href} className="capitalize">
              {label}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
