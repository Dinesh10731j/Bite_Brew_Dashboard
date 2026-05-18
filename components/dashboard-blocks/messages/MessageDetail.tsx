import type { Message } from "@/lib/shared";
import { BlockCard } from "@/components/dashboard-blocks/common";

export function MessageDetail({ data }: { data: Message }) {
  return (
    <BlockCard title="Message Content">
      <p className="rounded-3xl bg-brand-soft/50 p-5 text-sm leading-7 text-slate-600 dark:bg-white/5 dark:text-slate-200">
        {data.content}
      </p>
    </BlockCard>
  );
}
