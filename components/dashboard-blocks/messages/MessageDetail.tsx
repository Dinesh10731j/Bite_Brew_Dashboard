import type { Message } from "@/lib/types";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { messages } from "@/lib/mock-data";

export function MessageDetail({ data = messages[0] }: { data?: Message }) {
  return (
    <BlockCard title="Message Content">
      <p className="rounded-3xl bg-brand-soft/50 p-5 text-sm leading-7 text-slate-600 dark:bg-white/5 dark:text-slate-200">
        {data.content}
      </p>
    </BlockCard>
  );
}
