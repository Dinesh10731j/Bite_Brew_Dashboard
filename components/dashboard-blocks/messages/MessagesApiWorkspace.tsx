"use client";

import { useMemo, useState } from "react";
import { useMessages } from "@/hooks/useMessages";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { Modal } from "@/components/shared/ui/Modal";
import { Button } from "@/components/shared/ui/Button";
import type { Message } from "@/lib/types";
import { MessageCard } from "./MessageCard";
import { MessageDetail } from "./MessageDetail";
import { MessageFilters } from "./MessageFilters";
import { MessagesList } from "./MessagesList";

export function MessagesApiWorkspace() {
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");
  const [selectedId, setSelectedId] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);

  const messages = useMessages();

  const filtered = useMemo(() => {
    if (readFilter === "all") return messages.filteredMessages;
    if (readFilter === "read") return messages.filteredMessages.filter((item) => item.isRead);
    return messages.filteredMessages.filter((item) => !item.isRead);
  }, [messages.filteredMessages, readFilter]);

  const selected = useMemo(() => {
    return filtered.find((item) => item.id === selectedId) ?? filtered[0];
  }, [filtered, selectedId]);

  return (
    <div className="space-y-6">
      <ResourceNote error={messages.error || messages.mutationError} loading={messages.loading} fallbackLabel="messages" />

      <MessageFilters
        query={messages.query}
        readFilter={readFilter}
        onQueryChange={messages.setQuery}
        onReadFilterChange={setReadFilter}
      />

      <MessagesList
        data={filtered}
        onSelect={(message) => setSelectedId(message.id)}
        onToggleRead={messages.toggleRead}
        onDelete={(message) => setDeleteTarget(message)}
        busy={messages.mutating}
      />

      {selected && (
        <div className="grid gap-6 xl:grid-cols-2">
          <MessageCard data={selected} />
          <MessageDetail data={selected} />
        </div>
      )}

      <Modal open={Boolean(deleteTarget)}>
        {deleteTarget && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-ink dark:text-white">
              Delete message from {deleteTarget.senderName}?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              This action cannot be undone. The message will be removed from UI instantly and synced with backend.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={messages.mutating}
                onClick={async () => {
                  await messages.deleteMessage(deleteTarget);
                  setDeleteTarget(null);
                }}
              >
                {messages.mutating ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
