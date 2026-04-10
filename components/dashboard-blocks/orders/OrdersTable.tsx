import type { Order } from "@/lib/types";
import { GenericTable } from "@/components/dashboard-blocks/common";
import { TableActions } from "@/components/shared/tables/TableActions";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";

export function OrdersTable({ data }: { data: Order[] }) {
  return (
    <GenericTable
      title="Orders"
      description="Track dine-in, takeaway, and delivery activity."
      headers={["Order", "Customer", "Items", "Total", "Type", "Payment", "Status", "Actions"]}
      rows={data.map((order) => [
        order.id,
        `${order.customerName} • ${order.phone}`,
        order.itemsOrdered,
        formatCurrency(order.totalPrice),
        order.orderType,
        <PaymentMethodBadge key={`${order.id}-payment`} method={order.paymentMethod} />,
        <OrderStatusBadge key={`${order.id}-status`} status={order.orderStatus} />,
        <TableActions key={`${order.id}-actions`} />
      ])}
    />
  );
}
