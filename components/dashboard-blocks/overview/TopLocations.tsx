import { InsightList } from "@/components/dashboard-blocks/common";
import { Empty } from "@/components/shared/ui/Empty";

type TopLocation = { place?: string; visitors?: number };

export function TopLocations({ items = [] }: { items?: TopLocation[] }) {
  if (!items.length) {
    return <Empty title="No Traffic Locations" description="Backend did not return location analytics yet." />;
  }

  return <InsightList items={items} valueLabel="visitors" />;
}