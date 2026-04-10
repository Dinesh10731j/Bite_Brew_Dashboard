import type { Order } from "@/lib/types";
import { SimpleList } from "@/components/dashboard-blocks/common";
import { orders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function RecentOrders({ data = orders }: { data?: Order[] }) {
  return (
    <SimpleList
      items={data.slice(0, 5).map((order) => ({
        title: `${order.id} • ${order.customerName}`,
        subtitle: `${order.itemsOrdered} • ${formatCurrency(order.totalPrice)}`,
        badge: order.orderStatus,
        tone: "brand"
      }))}
    />
  );
}
