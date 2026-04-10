import type { Notification } from "@/lib/types";
import { SimpleList } from "@/components/dashboard-blocks/common";
import { notifications } from "@/lib/mock-data";

export function NotificationsWidget({ items = notifications }: { items?: Notification[] }) {
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
              : "neutral"
      }))}
    />
  );
}
