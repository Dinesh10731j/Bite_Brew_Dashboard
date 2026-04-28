import { InsightList } from "@/components/dashboard-blocks/common";
import { Empty } from "@/components/shared/ui/Empty";

type TopItem = { name?: string; orders?: number; revenue?: string; price?: string };

export function TopSellingItems({ items = [] }: { items?: TopItem[] }) {
  if (!items.length) {
    return <Empty title="No Top Items" description="Backend did not return top-selling items yet." />;
  }

  return <InsightList items={items} valueLabel="orders" />;
}