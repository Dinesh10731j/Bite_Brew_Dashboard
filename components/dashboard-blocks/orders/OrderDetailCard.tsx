import { DetailCard } from "@/components/dashboard-blocks/common";
import { orders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function OrderDetailCard() {
  const order = orders[0];
  return (
    <DetailCard
      title={`Order ${order.id}`}
      items={[
        { label: "Customer", value: order.customerName },
        { label: "Phone", value: order.phone },
        { label: "Email", value: order.email },
        { label: "Items", value: order.itemsOrdered },
        { label: "Quantity", value: String(order.quantity) },
        { label: "Total", value: formatCurrency(order.totalPrice) },
        { label: "Order Type", value: order.orderType },
        { label: "Payment Method", value: order.paymentMethod },
        { label: "Created", value: order.createdTime }
      ]}
    />
  );
}
