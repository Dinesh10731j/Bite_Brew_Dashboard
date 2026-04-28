import type { Order } from "@/lib/types";
import { SimpleList } from "@/components/dashboard-blocks/common";
import { formatCurrency } from "@/lib/utils";
import { Empty } from "@/components/shared/ui/Empty";

export function RecentOrders({ data = [] }: { data?: Order[] }) {
  if (!data.length) {
    return <Empty title="No Recent Orders" description="No order records were returned by backend yet." />;
  }

  return (
    <SimpleList
      items={data.slice(0, 5).map((order) => ({
        title: `${order.id} - ${order.customerName}`,
        subtitle: `${order.itemsOrdered} - ${formatCurrency(order.totalPrice)}`,
        badge: order.orderStatus,
        tone: "brand",
      }))}
    />
  );
}