import type { Message } from "@/lib/types";
import { SimpleList } from "@/components/dashboard-blocks/common";
import { Empty } from "@/components/shared/ui/Empty";

export function RecentMessages({ data = [] }: { data?: Message[] }) {
  if (!data.length) {
    return <Empty title="No Recent Messages" description="No customer messages were returned by backend yet." />;
  }

  return (
    <SimpleList
      items={data.slice(0, 5).map((message) => ({
        title: message.senderName,
        subtitle: message.content,
        badge: message.isRead ? "Read" : "Unread",
        tone: message.isRead ? "neutral" : "warning",
      }))}
    />
  );
}