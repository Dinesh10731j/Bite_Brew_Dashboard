import type { Notification } from "@/lib/shared";
import { Badge } from "@/components/shared/ui/Badge";
import { Empty } from "@/components/shared/ui/Empty";
import { Bell, MailWarning, ShoppingBag } from "lucide-react";

export function NotificationsWidget({ items = [] }: { items?: Notification[] }) {
  if (!items.length) {
    return <Empty title="No Notifications" description="No notifications were returned by backend yet." />;
  }

  return (
    <div className="space-y-3">
      {items.map((notification, index) => (
        <div
          key={`${notification.id}-${index}`}
          className="rounded-2xl border border-brand/15 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1 text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-300">
              {notification.type === "order" ? (
                <ShoppingBag className="h-3.5 w-3.5 text-brand" />
              ) : notification.type === "message" ? (
                <MailWarning className="h-3.5 w-3.5 text-brand" />
              ) : (
                <Bell className="h-3.5 w-3.5 text-brand" />
              )}
              {notification.type.toUpperCase()}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                tone={
                  notification.priority === "high"
                    ? "danger"
                    : notification.priority === "medium"
                      ? "warning"
                      : "neutral"
                }
              >
                {notification.priority.toUpperCase()}
              </Badge>
              <Badge tone={notification.isRead ? "neutral" : "brand"}>
                {notification.isRead ? "Read" : "Unread"}
              </Badge>
            </div>
          </div>
          <p className="mt-2 text-sm text-brand-ink dark:text-white">{notification.content}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">{notification.timestamp}</p>
        </div>
      ))}
    </div>
  );
}
