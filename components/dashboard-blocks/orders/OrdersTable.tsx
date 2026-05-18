"use client";

import { useState } from "react";
import type { Order } from "@/lib/shared";
import { GenericTable } from "@/components/dashboard-blocks/common";
import { formatCurrency } from "@/lib/shared";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { Select } from "@/components/shared/ui/Select";
import { Button } from "@/components/shared/ui/Button";
import { Modal } from "@/components/shared/ui/Modal";
import { AlertTriangle, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";


type OrdersTableProps = {
  data: Order[];
  onStatusChange: (order: Order, status: Order["orderStatus"]) => void;
  onDelete: (order: Order) => void;
  onEdit: (order: Order) => void;
  busy?: boolean;
};

export function OrdersTable({ data, onStatusChange, onDelete, onEdit, busy = false }: OrdersTableProps) {
  const [orderPendingDelete, setOrderPendingDelete] = useState<Order | null>(null);

  const closeDeleteModal = () => setOrderPendingDelete(null);

  const confirmDelete = () => {
    if (!orderPendingDelete) return;
    onDelete(orderPendingDelete);
    closeDeleteModal();
  };

  return (
    <>
      <GenericTable
        title="Orders"
        description="Track dine-in, takeaway, and delivery activity."
        headers={["Order", "Customer", "Items", "Qty", "Total", "Type", "Payment", "Status", "Actions"]}
        rows={data.map((order) => [
          <span key={`${order.id}-id`} className="font-medium">{order.id}</span>,
          `${order.customerName} - ${order.phone}`,
          <div key={`${order.id}-items`} className="flex items-center gap-3">
            {order.orderItemImages?.length ? (
              <div className="flex -space-x-2">
                {order.orderItemImages.slice(0, 3).map((src, idx) => (
                  <Image
                    key={`${order.id}-img-${idx}`}
                    src={src}
                    alt="order item"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-md border border-brand/10 object-cover"
                    unoptimized
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
              onClick={() => setOrderPendingDelete(order)}
              aria-label="Delete order"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>,
        ])}
      />

      <Modal open={Boolean(orderPendingDelete)} className="max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-red-600 p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-white/20 p-2">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">Delete Order</h3>
                <p className="mt-1 text-sm text-white/90">This action cannot be undone.</p>
              </div>
            </div>
            <button type="button" onClick={closeDeleteModal} className="rounded-lg p-1 hover:bg-white/20" aria-label="Close dialog">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-700 dark:text-rose-300">Order ID</p>
            <p className="mt-2 break-all text-sm font-medium text-slate-800 dark:text-slate-100">{orderPendingDelete?.id}</p>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            You are about to permanently delete this order record from the dashboard.
          </p>

          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={closeDeleteModal} disabled={busy}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={busy} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Order
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
