import Link from "next/link";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { Badge } from "@/components/shared/ui/Badge";
import { Empty } from "@/components/shared/ui/Empty";

export function ManagementPreview() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <BlockCard
        title="Menu & Pricing"
        description="Live records are available in the dedicated menu workspace."
        action={<Link href="/dashboard/management/menu" className="text-sm font-semibold text-brand">Open Menu</Link>}
      >
        <Empty title="No Inline Preview" description="Open Menu workspace to fetch live category and item data." />
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="brand">Live API only</Badge>
          <Badge tone="warning">No mock records</Badge>
        </div>
      </BlockCard>

      <BlockCard
        title="Gallery"
        description="Live records are available in the dedicated gallery workspace."
        action={<Link href="/dashboard/management/gallery" className="text-sm font-semibold text-brand">Open Gallery</Link>}
      >
        <Empty title="No Inline Preview" description="Open Gallery workspace to fetch live media records." />
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="brand">Live API only</Badge>
          <Badge tone="warning">No mock records</Badge>
        </div>
      </BlockCard>
    </div>
  );
}