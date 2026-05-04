"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dashboardApi } from "@/lib/api/dashboard";
import { extractList } from "@/services/api/http";
import { normalizeBoolean } from "@/lib/dashboard-normalizers";

type NotificationItem = {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  priority: string;
  actionLink: string;
};

type NotificationsContextType = {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  refresh: () => Promise<unknown>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

function normalizeNotification(item: any): NotificationItem {
  return {
    id: item?.id ?? item?._id ?? "",
    type: String(item?.type ?? "SYSTEM"),
    content: item?.content ?? "",
    timestamp: item?.createdAt ? new Date(item.createdAt).toLocaleString() : "-",
    isRead: normalizeBoolean(item?.isRead ?? item?.read),
    priority: String(item?.priority ?? "MEDIUM"),
    actionLink: item?.actionLink ?? "#",
  };
}

async function fetchNotifications(): Promise<NotificationItem[]> {
  const response = await dashboardApi.getNotifications({ page: 1, limit: 20 });
  return extractList<any>(response).map(normalizeNotification);
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 4000,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await dashboardApi.markNotificationRead(id, true);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<NotificationItem[]>(["notifications"]);
      queryClient.setQueryData<NotificationItem[]>(["notifications"], (current = []) =>
        current.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications"], context.previous);
      }
      toast.error("Failed to mark notification as read");
    },
    onSuccess: () => {
      toast.success("Notification marked as read");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: async () => {
      await dashboardApi.markAllNotificationsRead();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<NotificationItem[]>(["notifications"]);
      queryClient.setQueryData<NotificationItem[]>(["notifications"], (current = []) =>
        current.map((item) => ({ ...item, isRead: true }))
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications"], context.previous);
      }
      toast.error("Failed to mark all notifications as read");
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      await dashboardApi.deleteNotification(id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<NotificationItem[]>(["notifications"]);
      queryClient.setQueryData<NotificationItem[]>(["notifications"], (current = []) =>
        current.filter((item) => item.id !== id)
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications"], context.previous);
      }
      toast.error("Failed to delete notification");
    },
    onSuccess: () => {
      toast.success("Notification deleted");
    },
  });

  const notifications = query.data ?? [];
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const value = useMemo<NotificationsContextType>(
    () => ({
      notifications,
      unreadCount,
      loading: query.isLoading,
      isOpen,
      setIsOpen,
      refresh: () => query.refetch(),
      markRead: async (id: string) => {
        await markReadMutation.mutateAsync(id);
      },
      markAllRead: async () => {
        await markAllMutation.mutateAsync();
      },
      remove: async (id: string) => {
        await removeMutation.mutateAsync(id);
      },
    }),
    [
      notifications,
      unreadCount,
      query,
      isOpen,
      markReadMutation,
      markAllMutation,
      removeMutation,
    ]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotificationsStore() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotificationsStore must be used within NotificationsProvider");
  }
  return context;
}
