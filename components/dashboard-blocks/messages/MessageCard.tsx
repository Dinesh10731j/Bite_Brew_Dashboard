import type { Message } from "@/lib/types";
import { DetailCard } from "@/components/dashboard-blocks/common";
import { messages } from "@/lib/mock-data";

export function MessageCard({ data = messages[0] }: { data?: Message }) {
  const message = data;
  return (
    <DetailCard
      title={message.senderName}
      items={[
        { label: "Phone", value: message.phone },
        { label: "Email", value: message.email },
        { label: "Source", value: message.source },
        { label: "Timestamp", value: message.timestamp },
        { label: "Status", value: message.isRead ? "Read" : "Unread" },
        { label: "Reply", value: message.replyStatus }
      ]}
    />
  );
}
