"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { findArrayData, normalizeMessage } from "@/lib/dashboard-normalizers";
import type { Message } from "@/lib/types";

export function useMessages() {
  const [query, setQuery] = useState("");

  const resource = useBackendResource<Message[]>({
    fallback: [],
    resetOnError: true,
    loader: async () => {
      const response: any = await dashboardApi.getMessages({ page: 1, limit: 50 });
      const items = findArrayData(response);
      return items ? items.map(normalizeMessage) : [];
    },
  });

  const filteredMessages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return resource.data;

    return resource.data.filter((message) =>
      [message.senderName, message.email, message.phone, message.content, message.source]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, resource.data]);

  const toggleRead = useCallback(
    async (message: Message) => {
      const nextRead = !message.isRead;
      const targetId = message.backendId ?? message.id;

      await resource.runMutation(
        async () => {
          const response: any = await dashboardApi.markMessageRead(targetId, nextRead);
          const payload = response?.data ?? { ...message, isRead: nextRead };
          return normalizeMessage(payload);
        },
        {
          optimisticData: (current) =>
            current.map((entry) => (entry.id === message.id ? { ...entry, isRead: nextRead } : entry)),
          onSuccess: (updated, current) =>
            current.map((entry) => (entry.id === message.id ? { ...entry, ...updated } : entry)),
          onError: (error) => toast.error(error.message),
        }
      );

      toast.success(nextRead ? "Message marked as read" : "Message marked as unread");
    },
    [resource]
  );

  const deleteMessage = useCallback(
    async (message: Message) => {
      const targetId = message.backendId ?? message.id;

      await resource.runMutation(
        () => dashboardApi.deleteMessage(targetId),
        {
          optimisticData: (current) => current.filter((entry) => entry.id !== message.id),
          onError: (error) => toast.error(error.message),
        }
      );

      toast.success("Message deleted");
    },
    [resource]
  );

  return {
    ...resource,
    query,
    setQuery,
    filteredMessages,
    toggleRead,
    deleteMessage,
  };
}