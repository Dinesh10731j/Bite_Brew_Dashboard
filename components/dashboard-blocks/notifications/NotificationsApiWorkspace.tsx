"use client";

import { useMemo, useState } from "react";
import { DetailCard, GenericTable } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";
import { Button } from "@/components/shared/ui/Button";
import { useNotificationsStore } from "@/store/notifications-context";

export function NotificationsApiWorkspace() {
  const notifications = useNotificationsStore();
  const [query, setQuery] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");

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

      <GenericTable
        title="Notifications"
        description="Operational alerts and system updates."
        headers={["Type", "Message", "Time", "Read", "Priority", "Actions"]}
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
              onClick={() => void notifications.markRead(notification.id)}
              disabled={notification.isRead}
            >
              Mark read
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