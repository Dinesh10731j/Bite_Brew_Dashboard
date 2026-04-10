import { BlockCard } from "@/components/dashboard-blocks/common";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";

export function CampaignForm() {
  return (
    <BlockCard title="Send Email Campaign" action={<Button>Send Email</Button>}>
      <div className="grid gap-3">
        <Input placeholder="Campaign subject" />
        <textarea
          placeholder="Write your campaign message..."
          className="min-h-36 rounded-3xl border border-brand/15 bg-white px-4 py-3 text-sm outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>
    </BlockCard>
  );
}
