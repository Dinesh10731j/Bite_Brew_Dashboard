import { InsightList } from "@/components/dashboard-blocks/common";
import { topSellingItems } from "@/lib/mock-data";

export function TopSellingItems({ items = topSellingItems }: { items?: typeof topSellingItems }) {
  return <InsightList items={items} valueLabel="orders" />;
}
