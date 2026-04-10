"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-config";

type CollapsibleNavProps = {
  compact?: boolean;
  mode?: "sidebar" | "mobile";
  onNavigate?: () => void;
};

export function CollapsibleNav({ compact = false, mode = "sidebar", onNavigate }: CollapsibleNavProps) {
  const pathname = usePathname();
  const mobileCompact = compact && mode === "mobile";
  const sidebarCompact = compact && mode === "sidebar";

  return (
    <nav className={mobileCompact ? "grid grid-cols-4 gap-2 sm:grid-cols-5" : "space-y-2"}>
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
              mobileCompact && "flex-col justify-center px-2 py-2 text-[11px]",
              sidebarCompact && "justify-center px-0",
              active
                ? "bg-brand text-white shadow-lg shadow-brand/20"
                : "text-slate-600 hover:bg-brand-soft hover:text-brand-ink dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            )}
            title={sidebarCompact ? item.label : undefined}
          >
            <span>{item.icon}</span>
            {!compact && <span>{item.label}</span>}
            {mobileCompact && <span className="text-center leading-tight">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
