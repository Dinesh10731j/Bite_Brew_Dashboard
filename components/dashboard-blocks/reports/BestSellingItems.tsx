import { InsightList } from "@/components/dashboard-blocks/common";
import { topSellingItems } from "@/lib/mock-data";

export function BestSellingItems() {
  return <InsightList items={topSellingItems} valueLabel="orders" />;
}
