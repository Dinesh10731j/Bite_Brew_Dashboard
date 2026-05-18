"use client";

import type { Message } from "@/lib/shared";
import { GenericTable } from "@/components/dashboard-blocks/common";
import { Button } from "@/components/shared/ui/Button";

type Props = {
  data: Message[];
  onToggleRead: (message: Message) => void;
  onDelete: (message: Message) => void;
  onSelect: (message: Message) => void;
  busy?: boolean;
};

export function MessagesList({ data, onToggleRead, onDelete, onSelect, busy = false }: Props) {
  return (
    <GenericTable
      title="Inbox Messages"
      description="Customer queries from the website and social channels."
      headers={["Sender", "Contact", "Message", "Time", "Status", "Reply", "Source", "Actions"]}
      rows={data.map((message) => [
        message.senderName,
        `${message.phone} • ${message.email}`,
        message.content,
        message.timestamp,
        message.isRead ? "Read" : "Unread",
        message.replyStatus,
        message.source,
        <div key={`${message.id}-actions`} className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => onSelect(message)}>
            View
          </Button>
          <Button className="px-3 py-2 text-xs" onClick={() => onToggleRead(message)} disabled={busy}>
            {message.isRead ? "Unread" : "Read"}
          </Button>
          <Button variant="danger" className="px-3 py-2 text-xs" onClick={() => onDelete(message)} disabled={busy}>
            Delete
          </Button>
        </div>,
      ])}
    />
  );
}
