"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { BlockCard, DetailCard, GenericTable } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";
import { Button } from "@/components/shared/ui/Button";
import { useNotificationsStore } from "@/store/notifications-context";
import { dashboardApi } from "@/lib/api/dashboard";
import { toast } from "sonner";

export function NotificationsApiWorkspace() {
  const notifications = useNotificationsStore();
  const [query, setQuery] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const notificationForm = useForm({
    defaultValues: {
      content: "",
      type: "SYSTEM",
      priority: "MEDIUM",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: { content: string; type: string; priority: string }) => {
      await dashboardApi.createNotification(values);
    },
    onSuccess: async () => {
      notificationForm.reset();
      await notifications.refresh();
      toast.success("Notification created");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create notification");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: { id: string; content: string; type: string; priority: string }) => {
      await dashboardApi.updateNotification(values.id, {
        content: values.content,
        type: values.type,
        priority: values.priority,
      });
    },
    onSuccess: async () => {
      setEditingId(null);
      notificationForm.reset({ content: "", type: "SYSTEM", priority: "MEDIUM" });
      await notifications.refresh();
      toast.success("Notification updated");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update notification");
    },
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notifications.notifications.filter((item) => {
      const readPass =
        readFilter === "all" ? true : readFilter === "read" ? item.isRead : !item.isRead;
      const queryPass = !q
        ? true
        : [item.content, item.type, item.priority].join(" ").toLowerCase().includes(q);
      return readPass && queryPass;
    });
  }, [notifications.notifications, query, readFilter]);

  const latest = filtered[0];

  return (
    <div className="space-y-6 pb-24 xl:pb-6">
      <ResourceNote
        error=""
        loading={notifications.loading}
        fallbackLabel="notifications"
      />

      <div className="grid gap-3 md:grid-cols-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search notifications"
        />
        <Select
          value={readFilter}
          onChange={(event) => setReadFilter(event.target.value as "all" | "read" | "unread")}
        >
          <option value="all">All notifications</option>
          <option value="unread">Unread only</option>
          <option value="read">Read only</option>
        </Select>
      </div>

      <BlockCard title="Create Notification" description="Create an operational alert for dashboard users.">
        <form
          className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]"
          onSubmit={notificationForm.handleSubmit((values) =>
            editingId
              ? updateMutation.mutateAsync({ id: editingId, ...values })
              : createMutation.mutateAsync(values)
          )}
        >
          <Input
            {...notificationForm.register("content", { required: true, minLength: 2 })}
            placeholder="Notification content"
          />
          <Select {...notificationForm.register("type")}>
            <option value="SYSTEM">SYSTEM</option>
            <option value="ORDER">ORDER</option>
            <option value="MESSAGE">MESSAGE</option>
          </Select>
          <Select {...notificationForm.register("priority")}>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="LOW">LOW</option>
          </Select>
          <Button
            type="submit"
            disabled={
              !notificationForm.watch("content").trim() ||
              createMutation.isPending ||
              updateMutation.isPending
            }
          >
            {editingId
              ? updateMutation.isPending
                ? "Saving..."
                : "Save"
              : createMutation.isPending
                ? "Creating..."
                : "Create"}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                notificationForm.reset({ content: "", type: "SYSTEM", priority: "MEDIUM" });
              }}
            >
              Cancel
            </Button>
          ) : null}
        </form>
      </BlockCard>

      <GenericTable
        title="Notifications"
        description="Operational alerts and system updates."
        headers={["Type", "Message", "Time", "Read", "Priority", "Actions"]}
        page={notifications.page}
        totalPages={notifications.totalPages}
        onPreviousPage={() => notifications.setPage(notifications.page - 1)}
        onNextPage={() => notifications.setPage(notifications.page + 1)}
        rows={filtered.map((notification) => [
          notification.type,
          notification.content,
          notification.timestamp,
          notification.isRead ? "Read" : "Unread",
          notification.priority,
          <div key={notification.id} className="flex gap-2">
            <Button
              variant="secondary"
              className="px-3 py-2 text-xs"
              onClick={() => void notifications.markRead(notification.id, !notification.isRead)}
            >
              {notification.isRead ? "Mark unread" : "Mark read"}
            </Button>
            <Button
              variant="secondary"
              className="px-3 py-2 text-xs"
              onClick={() => {
                setEditingId(notification.id);
                notificationForm.reset({
                  content: notification.content,
                  type: notification.type,
                  priority: notification.priority,
                });
              }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              className="px-3 py-2 text-xs"
              onClick={() => void notifications.remove(notification.id)}
            >
              Delete
            </Button>
          </div>,
        ])}
      />

      <div className="flex justify-end">
        <Button onClick={() => void notifications.markAllRead()}>
          Mark All as Read
        </Button>
      </div>

      {latest ? (
        <DetailCard
          title="Latest Notification"
          items={[
            { label: "Type", value: latest.type },
            { label: "Content", value: latest.content },
            { label: "Priority", value: latest.priority },
            { label: "Timestamp", value: latest.timestamp },
          ]}
        />
      ) : null}
    </div>
  );
}
