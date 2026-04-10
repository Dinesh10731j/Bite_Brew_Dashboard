import type { Message } from "@/lib/types";
import { SimpleList } from "@/components/dashboard-blocks/common";
import { messages } from "@/lib/mock-data";

export function RecentMessages({ data = messages }: { data?: Message[] }) {
  return (
    <SimpleList
      items={data.slice(0, 5).map((message) => ({
        title: message.senderName,
        subtitle: message.content,
        badge: message.isRead ? "Read" : "Unread",
        tone: message.isRead ? "neutral" : "warning"
      }))}
    />
  );
}
