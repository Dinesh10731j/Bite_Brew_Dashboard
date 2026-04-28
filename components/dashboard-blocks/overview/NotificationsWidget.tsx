import type { Notification } from "@/lib/types";
import { SimpleList } from "@/components/dashboard-blocks/common";
import { Empty } from "@/components/shared/ui/Empty";

export function NotificationsWidget({ items = [] }: { items?: Notification[] }) {
  if (!items.length) {
    return <Empty title="No Notifications" description="No notifications were returned by backend yet." />;
  }

  return (
    <SimpleList
      items={items.map((notification) => ({
        title: notification.type.toUpperCase(),
        subtitle: notification.content,
        badge: notification.priority,
        tone:
          notification.priority === "high"
            ? "danger"
            : notification.priority === "medium"
              ? "warning"
              : "neutral",
      }))}
    />
  );
}