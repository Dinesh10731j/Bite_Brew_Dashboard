"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/shared";
import { navItems } from "./nav-config";
import { useNotificationsStore } from "@/store/notifications-context";
import { useOrders } from "@/hooks/useOrders";
import { useMessages } from "@/hooks/useMessages";

type CollapsibleNavProps = {
  compact?: boolean;
  mode?: "sidebar" | "mobile";
  onNavigate?: () => void;
};

export function CollapsibleNav({ compact = false, mode = "sidebar", onNavigate }: CollapsibleNavProps) {
  const pathname = usePathname();
  const notifications = useNotificationsStore();
  const orders = useOrders();
  const messages = useMessages();
  const [seenOrderIds, setSeenOrderIds] = useState<string[]>([]);
  const [seenMessageIds, setSeenMessageIds] = useState<string[]>([]);
  const [seenNotificationIds, setSeenNotificationIds] = useState<string[]>([]);
  const mobileCompact = compact && mode === "mobile";
  const sidebarCompact = compact && mode === "sidebar";
  const onNotificationsPage = pathname === "/dashboard/notifications" || pathname.startsWith("/dashboard/notifications/");
  const onOrdersPage = pathname === "/dashboard/orders" || pathname.startsWith("/dashboard/orders/");
  const onMessagesPage = pathname === "/dashboard/messages" || pathname.startsWith("/dashboard/messages/");
  const orderIdSignature = useMemo(() => orders.data.map((order) => order.id).join("|"), [orders.data]);
  const messageIdSignature = useMemo(() => messages.data.map((message) => message.id).join("|"), [messages.data]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("seen_order_ids");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSeenOrderIds(parsed.filter((value): value is string => typeof value === "string"));
      }
      const rawMessages = window.localStorage.getItem("seen_message_ids");
      if (rawMessages) {
        const parsedMessages = JSON.parse(rawMessages);
        if (Array.isArray(parsedMessages)) {
          setSeenMessageIds(parsedMessages.filter((value): value is string => typeof value === "string"));
        }
      }
      const rawNotifications = window.localStorage.getItem("seen_notification_ids");
      if (rawNotifications) {
        const parsedNotifications = JSON.parse(rawNotifications);
        if (Array.isArray(parsedNotifications)) {
          setSeenNotificationIds(parsedNotifications.filter((value): value is string => typeof value === "string"));
        }
      }
    } catch {
      setSeenOrderIds([]);
      setSeenMessageIds([]);
      setSeenNotificationIds([]);
    }
  }, []);

  useEffect(() => {
    if (!onOrdersPage || !orderIdSignature || typeof window === "undefined") return;
    const allOrderIds = orders.data.map((order) => order.id);
    setSeenOrderIds((prev) => {
      const nextSerialized = JSON.stringify(allOrderIds);
      const prevSerialized = JSON.stringify(prev);
      if (nextSerialized === prevSerialized) return prev;
      window.localStorage.setItem("seen_order_ids", nextSerialized);
      return allOrderIds;
    });
  }, [onOrdersPage, orderIdSignature, orders.data]);

  useEffect(() => {
    if (!onMessagesPage || !messageIdSignature || typeof window === "undefined") return;
    const unreadMessageIds = messages.data.filter((item) => !item.isRead).map((item) => item.id);
    setSeenMessageIds((prev) => {
      const next = Array.from(new Set([...prev, ...unreadMessageIds]));
      const nextSerialized = JSON.stringify(next);
      const prevSerialized = JSON.stringify(prev);
      if (nextSerialized === prevSerialized) return prev;
      window.localStorage.setItem("seen_message_ids", nextSerialized);
      return next;
    });
  }, [onMessagesPage, messageIdSignature, messages.data]);

  useEffect(() => {
    if (!onNotificationsPage || notifications.notifications.length === 0 || typeof window === "undefined") return;
    const unreadNotificationIds = notifications.notifications.filter((item) => !item.isRead).map((item) => item.id);
    setSeenNotificationIds((prev) => {
      const next = Array.from(new Set([...prev, ...unreadNotificationIds]));
      const nextSerialized = JSON.stringify(next);
      const prevSerialized = JSON.stringify(prev);
      if (nextSerialized === prevSerialized) return prev;
      window.localStorage.setItem("seen_notification_ids", nextSerialized);
      return next;
    });
  }, [onNotificationsPage, notifications.notifications]);

  const newOrdersCount = useMemo(() => {
    if (orders.data.length === 0) return 0;
    const seen = new Set(seenOrderIds);
    return orders.data.filter((order) => !seen.has(order.id)).length;
  }, [orders.data, seenOrderIds]);

  const newMessagesCount = useMemo(() => {
    if (messages.data.length === 0) return 0;
    const seen = new Set(seenMessageIds);
    return messages.data.filter((message) => !message.isRead && !seen.has(message.id)).length;
  }, [messages.data, seenMessageIds]);

  const newNotificationsCount = useMemo(() => {
    if (notifications.notifications.length === 0) return 0;
    const seen = new Set(seenNotificationIds);
    return notifications.notifications.filter((item) => !item.isRead && !seen.has(item.id)).length;
  }, [notifications.notifications, seenNotificationIds]);

  const notificationsCount = onNotificationsPage ? 0 : newNotificationsCount;
  const ordersCount = onOrdersPage ? 0 : newOrdersCount;
  const messagesCount = onMessagesPage ? 0 : newMessagesCount;

  const navCountByHref: Record<string, number> = {
    "/dashboard/orders": ordersCount,
    "/dashboard/messages": messagesCount,
    "/dashboard/notifications": notificationsCount,
  };

  return (
    <nav className={mobileCompact ? "grid grid-cols-4 gap-2 sm:grid-cols-5" : "space-y-2"}>
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const count = navCountByHref[item.href] ?? 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.2,0.9,0.2,1)]",
              mobileCompact && "flex-col justify-center px-2 py-2 text-[11px]",
              sidebarCompact && "justify-center px-0",
              active
                ? "bg-brand text-white shadow-[0_0_0_1px_rgba(32,118,89,0.25)] shadow-brand/30 ring-1 ring-white/10"
                : "text-slate-600 hover:bg-brand-soft hover:text-brand-ink dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            )}
            title={sidebarCompact ? item.label : undefined}
          >
            <span className="relative">
              {item.icon}
              {count > 0 ? (
                <span
                  className={cn(
                    "absolute -right-2 -top-2 min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white",
                    count > 99 && "px-1"
                  )}
                >
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </span>
            {!compact && <span>{item.label}</span>}
            {mobileCompact && <span className="text-center leading-tight">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
