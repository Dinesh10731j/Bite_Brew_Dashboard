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
  page: number;
  totalPages: number;
  isOpen: boolean;
  setPage: (page: number) => void;
  setIsOpen: (value: boolean) => void;
  refresh: () => Promise<unknown>;
  markRead: (id: string, isRead?: boolean) => Promise<void>;
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

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: async () => {
      const response = await dashboardApi.getNotifications({ page, limit });
      const list = extractList<any>(response).map(normalizeNotification);
      const pagination = (response as any)?.pagination ?? (response as any)?.data?.pagination ?? {};
      const totalPages = Number(
        pagination?.totalPages ??
          pagination?.pages ??
          pagination?.totalPage ??
          Math.ceil(Number(pagination?.total ?? pagination?.totalItems ?? list.length) / Number(pagination?.limit ?? limit))
      );
      return {
        notifications: list,
        totalPages: Math.max(1, totalPages || 1),
      };
    },
    staleTime: 4000,
  });

  const markReadMutation = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      await dashboardApi.markNotificationRead(id, isRead);
      return { id, isRead };
    },
    onMutate: async ({ id, isRead }) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<{ notifications: NotificationItem[]; totalPages: number }>([
        "notifications",
        page,
        limit,
      ]);
      queryClient.setQueryData<{ notifications: NotificationItem[]; totalPages: number }>(
        ["notifications", page, limit],
        (current) =>
          current
            ? {
                ...current,
                notifications: current.notifications.map((item) =>
                  item.id === id ? { ...item, isRead } : item
                ),
              }
            : current
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications", page, limit], context.previous);
      }
      toast.error("Failed to update read status");
    },
    onSuccess: (_result, variables) => {
      toast.success(variables.isRead ? "Notification marked as read" : "Notification marked as unread");
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
      const previous = queryClient.getQueriesData<{ notifications: NotificationItem[]; totalPages: number }>({
        queryKey: ["notifications"],
      });
      queryClient.setQueriesData<{ notifications: NotificationItem[]; totalPages: number }>(
        { queryKey: ["notifications"] },
        (current) =>
          current
            ? { ...current, notifications: current.notifications.map((item) => ({ ...item, isRead: true })) }
            : current
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous?.length) {
        for (const [key, value] of context.previous) {
          queryClient.setQueryData(key, value);
        }
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
      const previous = queryClient.getQueryData<{ notifications: NotificationItem[]; totalPages: number }>([
        "notifications",
        page,
        limit,
      ]);
      queryClient.setQueryData<{ notifications: NotificationItem[]; totalPages: number }>(
        ["notifications", page, limit],
        (current) =>
          current
            ? { ...current, notifications: current.notifications.filter((item) => item.id !== id) }
            : current
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications", page, limit], context.previous);
      }
      toast.error("Failed to delete notification");
    },
    onSuccess: () => {
      toast.success("Notification deleted");
    },
  });

  const notifications = query.data?.notifications ?? [];
  const totalPages = query.data?.totalPages ?? 1;
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const value = useMemo<NotificationsContextType>(
    () => ({
      notifications,
      unreadCount,
      loading: query.isLoading,
      page,
      totalPages,
      isOpen,
      setPage: (nextPage: number) => {
        setPage(Math.max(1, Math.min(totalPages, nextPage)));
      },
      setIsOpen,
      refresh: () => query.refetch(),
      markRead: async (id: string, isRead = true) => {
        await markReadMutation.mutateAsync({ id, isRead });
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
      page,
      totalPages,
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
