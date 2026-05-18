import type { Message } from "@/lib/shared";
import { SimpleList } from "@/components/dashboard-blocks/common";
import { Empty } from "@/components/shared/ui/Empty";
import { Mail, MailOpen } from "lucide-react";

export function RecentMessages({ data = [] }: { data?: Message[] }) {
  if (!data.length) {
    return <Empty title="No Recent Messages" description="No customer messages were returned by backend yet." />;
  }

  return (
    <SimpleList
      items={data.slice(0, 5).map((message) => ({
        title: message.senderName,
        subtitle: message.content,
        icon: message.isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />,
        badge: message.isRead ? "Read" : "Unread",
        tone: message.isRead ? "neutral" : "warning",
      }))}
    />
  );
}
