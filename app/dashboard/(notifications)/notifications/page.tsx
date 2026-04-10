import { NotificationCard } from "@/components/dashboard-blocks/notifications/NotificationCard";
import { NotificationFilters } from "@/components/dashboard-blocks/notifications/NotificationFilters";
import { NotificationsList } from "@/components/dashboard-blocks/notifications/NotificationsList";

export default function NotificationsPage() {
  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <NotificationFilters />
      <NotificationsList />
      <NotificationCard />
    </div>
  );
}
