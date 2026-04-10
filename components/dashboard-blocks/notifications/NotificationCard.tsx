import { DetailCard } from "@/components/dashboard-blocks/common";
import { notifications } from "@/lib/mock-data";

export function NotificationCard() {
  const notification = notifications[0];
  return (
    <DetailCard
      title="Latest Notification"
      items={[
        { label: "Type", value: notification.type },
        { label: "Content", value: notification.content },
        { label: "Priority", value: notification.priority },
        { label: "Timestamp", value: notification.timestamp }
      ]}
    />
  );
}
