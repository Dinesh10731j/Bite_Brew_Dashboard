"use client";

import type { Order } from "@/lib/types";
import { GenericTable } from "@/components/dashboard-blocks/common";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { Select } from "@/components/shared/ui/Select";
import { Pencil, Trash2 } from "lucide-react";


type OrdersTableProps = {
  data: Order[];
  onStatusChange: (order: Order, status: Order["orderStatus"]) => void;
  onEdit: (order: Order) => void;
  busy?: boolean;
};

export function OrdersTable({ data, onStatusChange, onEdit, busy = false }: OrdersTableProps) {
  return (
    <GenericTable
      title="Orders"
      description="Track dine-in, takeaway, and delivery activity."
      headers={["Order", "Customer", "Items", "Qty", "Total", "Type", "Payment", "Status", "Actions"]}
      rows={data.map((order) => [
        <span key={`${order.id}-id`} className="font-medium">{order.id}</span>,
        order.id,
        `${order.customerName} - ${order.phone}`,
        <div key={`${order.id}-items`} className="flex items-center gap-3">
          {order.orderItemImages?.length ? (
            <div className="flex -space-x-2">
              {order.orderItemImages.slice(0, 3).map((src, idx) => (
                <img
                  key={`${order.id}-img-${idx}`}
                  src={src}
                  alt="order item"
                  className="h-8 w-8 rounded-md border border-brand/10 object-cover"
                />
              ))}
            </div>
          ) : null}
          <span className="text-sm text-slate-700 dark:text-slate-200">{order.itemsOrdered}</span>
        </div>,
        order.quantity,
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
        <div key={`${order.id}-actions`} className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md p-2 text-brand hover:bg-brand-soft/50"
            aria-label="Edit order"
            onClick={() => onEdit(order)}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-md p-2 text-danger hover:bg-danger-soft/20 disabled:opacity-50"
            disabled={busy}
            onClick={() => {
              // delete API not wired in this UI yet
              // (kept as placeholder so Actions column shows delete icon)
              // eslint-disable-next-line no-console
              console.log("Delete order clicked", order.backendId ?? order.id);
            }}
            aria-label="Delete order"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>,
      ])}
    />
  );
}
