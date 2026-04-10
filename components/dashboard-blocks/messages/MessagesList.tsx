import type { Message } from "@/lib/types";
import { GenericTable } from "@/components/dashboard-blocks/common";

export function MessagesList({ data }: { data: Message[] }) {
  return (
    <GenericTable
      title="Inbox Messages"
      description="Customer queries from the website and social channels."
      headers={["Sender", "Contact", "Message", "Time", "Status", "Reply", "Source"]}
      rows={data.map((message) => [
        message.senderName,
        `${message.phone} • ${message.email}`,
        message.content,
        message.timestamp,
        message.isRead ? "Read" : "Unread",
        message.replyStatus,
        message.source
      ])}
    />
  );
}
