"use client";

import { BellDot, BriefcaseBusiness, Menu, PanelLeftClose, PanelLeftOpen, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { ThemeToggle } from "./ThemeToggle";
import { useNotificationsStore } from "@/store/notifications-context";
import { Button } from "@/components/shared/ui/Button";
import { Badge } from "@/components/shared/ui/Badge";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { TopBarProps } from "@/lib/shared";
import { getGreeting } from "@/lib/shared";
import Image from "next/image";
import logoSrc from "@/app/assets/images/bite_brew_logo.jpeg";

export function TopBar({ sidebarCollapsed, onToggleSidebar, onOpenMobileSidebar }: TopBarProps) {
  const notifications = useNotificationsStore();
  const toggleNotifications = () => {
    const nextOpen = !notifications.isOpen;
    notifications.setIsOpen(nextOpen);

    if (nextOpen && notifications.unreadCount > 0) {
      void notifications.markAllRead();
    }
  };

  const currentUser = useCurrentUser();
  const greeting = getGreeting(new Date());
  const userName = currentUser.user?.name?.trim() || "Dinesh Tamang";


  return (
    <header className="sticky top-0 z-30 rounded-3xl border border-white/50 bg-white/75 p-3 backdrop-blur-xl sm:p-4 dark:border-white/10 dark:bg-[#0d1412]/75">
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
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-10 w-10 shrink-0 rounded-2xl bg-brand/10 p-2 ring-1 ring-brand/15 dark:bg-white/5">
              <Image
                src={logoSrc}
                alt="Cafe"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-brand-ink sm:text-2xl dark:text-white">Cafe command center</h2>
              <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-300">Monitor visitors, orders, and team activity in one place.</p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:gap-3 lg:w-auto">
          <ThemeToggle />

          <div className="relative">
            <button
              onClick={toggleNotifications}
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
              <div className="absolute right-0 z-40 mt-2 w-[min(92vw,360px)] rounded-2xl border border-brand/15 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#12201b]">
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

          <div className="w-full rounded-2xl border border-brand/15 bg-white px-3 py-2.5 shadow-sm sm:w-auto sm:px-4 sm:py-3 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-brand/10 p-2 ring-1 ring-brand/15 dark:bg-white/10 dark:ring-white/15">
              <Image
                src={logoSrc}
                alt="Operations"
                className="h-full w-full rounded-2xl object-cover"
              />
              </div>
              <div className="text-left">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                  <BriefcaseBusiness className="h-3.5 w-3.5 text-brand" />
                  Operations
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold leading-tight text-brand-ink dark:text-white">
                  <Sparkles className="h-3.5 w-3.5 text-brand" />
                  {greeting}
                </p>
                <p className="mt-0.5 text-sm font-medium text-brand-ink dark:text-white">{currentUser.isLoading ? "Loading user..." : userName}</p>
              </div>
            </div>
            <div className="mt-2 hidden items-center gap-2 sm:flex">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-1 text-[10px] font-medium text-brand-ink dark:bg-white/10 dark:text-white">
                <BriefcaseBusiness className="h-3.5 w-3.5 text-brand" />
                Operations Lead
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
