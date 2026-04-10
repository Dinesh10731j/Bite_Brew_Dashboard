"use client";

import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { messages as fallbackMessages } from "@/lib/mock-data";
import { useBackendResource } from "@/hooks/useBackendResource";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { MessageCard } from "./MessageCard";
import { MessageDetail } from "./MessageDetail";
import { MessageFilters } from "./MessageFilters";
import { MessagesList } from "./MessagesList";

function normalizeMessage(item: any) {
  return {
    id: item?.id ?? item?._id ?? "MSG",
    senderName: item?.senderName ?? "Customer",
    phone: item?.phone ?? "-",
    email: item?.email ?? "-",
    content: item?.content ?? "",
    timestamp: item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
    isRead: Boolean(item?.isRead),
    replyStatus: item?.replyStatus ?? "pending",
    source: item?.source ?? "Website form"
  };
}

export function MessagesApiWorkspace() {
  const token = getAccessToken();
  const resource = useBackendResource(fallbackMessages, async () => {
    if (!token) {
      return fallbackMessages;
    }

    const response: any = await dashboardApi.getMessages(token, { page: 1, limit: 20 });
    const items = response?.data ?? [];
    return Array.isArray(items) ? items.map(normalizeMessage) : fallbackMessages;
  });

  return (
    <div className="space-y-6">
      <ResourceNote error={resource.error} loading={resource.loading} fallbackLabel="messages" />
      <MessageFilters />
      <MessagesList data={resource.data} />
      <div className="grid gap-6 xl:grid-cols-2">
        <MessageCard data={resource.data[0]} />
        <MessageDetail data={resource.data[0]} />
      </div>
    </div>
  );
}
