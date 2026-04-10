"use client";

import { BellDot, Menu, PanelLeftClose, PanelLeftOpen, Search, UserCircle2 } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { ThemeToggle } from "./ThemeToggle";

type TopBarProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
};

export function TopBar({ sidebarCollapsed, onToggleSidebar, onOpenMobileSidebar }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 rounded-3xl border border-white/50 bg-white/75 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1412]/75">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={onOpenMobileSidebar}
              className="rounded-2xl border border-brand/15 bg-white p-3 text-brand xl:hidden dark:border-white/10 dark:bg-white/5"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={onToggleSidebar}
              className="hidden rounded-2xl border border-brand/15 bg-white p-3 text-brand xl:block dark:border-white/10 dark:bg-white/5"
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>
            <Breadcrumbs />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-brand-ink dark:text-white">Cafe command center</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">Monitor visitors, orders, and team activity in one place.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-brand/15 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              placeholder="Search orders, users, items"
              className="bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-white"
            />
          </div>
          <ThemeToggle />
          <button className="rounded-2xl border border-brand/15 bg-white p-3 dark:border-white/10 dark:bg-white/5">
            <BellDot className="h-5 w-5 text-brand" />
          </button>
          <div className="flex items-center gap-3 rounded-2xl bg-brand px-4 py-3 text-white">
            <UserCircle2 className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-semibold">Admin Panel</p>
              <p className="text-xs text-white/80">Operations Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
