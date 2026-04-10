import { InsightList } from "@/components/dashboard-blocks/common";
import { topLocations } from "@/lib/mock-data";

export function TopLocations({ items = topLocations }: { items?: typeof topLocations }) {
  return <InsightList items={items} valueLabel="visitors" />;
}
