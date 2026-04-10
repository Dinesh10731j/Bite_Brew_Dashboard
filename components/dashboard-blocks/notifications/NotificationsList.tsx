import { GenericTable } from "@/components/dashboard-blocks/common";
import { notifications } from "@/lib/mock-data";

export function NotificationsList() {
  return (
    <GenericTable
      title="Notifications"
      description="Operational alerts and system updates."
      headers={["Type", "Message", "Time", "Read", "Priority", "Action"]}
      rows={notifications.map((notification) => [
        notification.type,
        notification.content,
        notification.timestamp,
        notification.isRead ? "Read" : "Unread",
        notification.priority,
        "View"
      ])}
    />
  );
}
