"use client";

import type { Order } from "@/lib/types";
import { GenericTable } from "@/components/dashboard-blocks/common";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { Select } from "@/components/shared/ui/Select";
import { Button } from "@/components/shared/ui/Button";

type OrdersTableProps = {
  data: Order[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  onStatusChange: (order: Order, status: Order["orderStatus"]) => void;
  busy?: boolean;
};

export function OrdersTable({ data, onEdit, onDelete, onStatusChange, busy = false }: OrdersTableProps) {
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
        <div key={`${order.id}-actions`} className="flex gap-2">
          <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => onEdit(order)} disabled={busy}>
            Edit
          </Button>
          <Button variant="danger" className="px-3 py-2 text-xs" onClick={() => onDelete(order)} disabled={busy}>
            Delete
          </Button>
        </div>,
      ])}
    />
  );
}
