"use client";

import { BellDot, Menu, PanelLeftClose, PanelLeftOpen, Search, Trash2, UserCircle2 } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { ThemeToggle } from "./ThemeToggle";
import { useNotificationsStore } from "@/store/notifications-context";
import { Button } from "@/components/shared/ui/Button";
import { Badge } from "@/components/shared/ui/Badge";

type TopBarProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
};

export function TopBar({ sidebarCollapsed, onToggleSidebar, onOpenMobileSidebar }: TopBarProps) {
  const notifications = useNotificationsStore();

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

          <div className="relative">
            <button
              onClick={() => notifications.setIsOpen(!notifications.isOpen)}
              className="relative rounded-2xl border border-brand/15 bg-white p-3 dark:border-white/10 dark:bg-white/5"
              aria-label="Notifications"
            >
              <BellDot className="h-5 w-5 text-brand" />
              {notifications.unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-xs font-bold text-white">
                  {notifications.unreadCount}
                </span>
              ) : null}
            </button>

            {notifications.isOpen ? (
              <div className="absolute right-0 z-40 mt-2 w-[360px] rounded-2xl border border-brand/15 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#12201b]">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-brand-ink dark:text-white">Notifications</h4>
                  <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => void notifications.markAllRead()}>
                    Mark all as read
                  </Button>
                </div>

                <div className="max-h-[320px] space-y-2 overflow-auto">
                  {notifications.notifications.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-brand/20 px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-300">
                      No notifications
                    </p>
                  ) : (
                    notifications.notifications.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-brand/10 p-3 dark:border-white/10"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge tone={item.isRead ? "neutral" : "danger"}>{item.isRead ? "Read" : "Unread"}</Badge>
                            <Badge tone="brand">{item.type}</Badge>
                          </div>
                          <button
                            onClick={() => void notifications.remove(item.id)}
                            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-white/10"
                            aria-label="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          className="w-full text-left"
                          onClick={() => {
                            if (!item.isRead) {
                              void notifications.markRead(item.id);
                            }
                          }}
                        >
                          <p className="text-sm font-medium text-brand-ink dark:text-white">{item.content}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{item.timestamp}</p>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

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