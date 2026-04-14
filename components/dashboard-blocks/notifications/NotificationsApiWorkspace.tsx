"use client";

import { DetailCard, GenericTable } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { notifications as fallbackNotifications } from "@/lib/mock-data";
import { NotificationFilters } from "./NotificationFilters";

type NotificationRow = {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  priority: string;
  actionLink: string;
};

function normalizeNotification(item: any): NotificationRow {
  return {
    id: item?.id ?? item?._id ?? "NOT-1",
    type: String(item?.type ?? "SYSTEM"),
    content: item?.content ?? "",
    timestamp: item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
    isRead: Boolean(item?.isRead),
    priority: String(item?.priority ?? "MEDIUM"),
    actionLink: item?.actionLink ?? "#"
  };
}

export function NotificationsApiWorkspace() {
  const resource = useBackendResource<NotificationRow[]>(
    fallbackNotifications.map((item) => ({
      id: item.id,
      type: item.type,
      content: item.content,
      timestamp: item.timestamp,
      isRead: item.isRead,
      priority: item.priority,
      actionLink: item.actionLink
    })),
    async () => {
      const token = getAccessToken();
      const response: any = await dashboardApi.getNotifications(token, { page: 1, limit: 20 });
      const items = response?.data ?? [];
      return Array.isArray(items)
        ? items.map(normalizeNotification)
        : fallbackNotifications.map((item) => ({
            id: item.id,
            type: item.type,
            content: item.content,
            timestamp: item.timestamp,
            isRead: item.isRead,
            priority: item.priority,
            actionLink: item.actionLink
          }));
    }
  );

  const latest = resource.data[0];

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote error={resource.error} loading={resource.loading} fallbackLabel="notifications" />
      <NotificationFilters />
      <GenericTable
        title="Notifications"
        description="Operational alerts and system updates."
        headers={["Type", "Message", "Time", "Read", "Priority", "Action"]}
        rows={resource.data.map((notification) => [
          notification.type,
          notification.content,
          notification.timestamp,
          notification.isRead ? "Read" : "Unread",
          notification.priority,
          "View"
        ])}
      />
      {latest ? (
        <DetailCard
          title="Latest Notification"
          items={[
            { label: "Type", value: latest.type },
            { label: "Content", value: latest.content },
            { label: "Priority", value: latest.priority },
            { label: "Timestamp", value: latest.timestamp }
          ]}
        />
      ) : null}
    </div>
  );
}
