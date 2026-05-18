import type { Message } from "@/lib/shared";
import { DetailCard } from "@/components/dashboard-blocks/common";

export function MessageCard({ data }: { data: Message }) {
  return (
    <DetailCard
      title={data.senderName}
      items={[
        { label: "Phone", value: data.phone },
        { label: "Email", value: data.email },
        { label: "Source", value: data.source },
        { label: "Timestamp", value: data.timestamp },
        { label: "Status", value: data.isRead ? "Read" : "Unread" },
        { label: "Reply", value: data.replyStatus },
      ]}
    />
  );
}
