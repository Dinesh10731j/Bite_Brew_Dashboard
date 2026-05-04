"use client";

import type { Order } from "@/lib/types";
import { GenericTable } from "@/components/dashboard-blocks/common";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { Select } from "@/components/shared/ui/Select";

type OrdersTableProps = {
  data: Order[];
  onStatusChange: (order: Order, status: Order["orderStatus"]) => void;
  busy?: boolean;
};

export function OrdersTable({ data, onStatusChange, busy = false }: OrdersTableProps) {
  return (
    <GenericTable
      title="Orders"
      description="Track dine-in, takeaway, and delivery activity."
      headers={["Order", "Customer", "Items", "Total", "Type", "Payment", "Status"]}
      rows={data.map((order) => [
        order.id,
        `${order.customerName} - ${order.phone}`,
        order.itemsOrdered,
        formatCurrency(order.totalPrice),
        order.orderType,
        <PaymentMethodBadge key={`${order.id}-payment`} method={order.paymentMethod} />,
        <div key={`${order.id}-status`} className="space-y-2">
          <OrderStatusBadge status={order.orderStatus} />
          <Select
            value={order.orderStatus}
            onChange={(event) => onStatusChange(order, event.target.value as Order["orderStatus"])}
            className="py-2 text-xs"
            disabled={busy}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>,
      ])}
    />
  );
}
