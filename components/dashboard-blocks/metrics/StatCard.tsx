import { Badge } from "@/components/shared/ui/Badge";
import { Card } from "@/components/shared/ui/Card";

export function StatCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-300">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-brand-ink dark:text-white">{value}</p>
      </div>
      <Badge tone="brand">{trend}</Badge>
    </Card>
  );
}
