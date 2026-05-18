"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order } from "@/lib/shared";
import { Modal } from "@/components/shared/ui/Modal";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";

import { toast } from "sonner";
import { dashboardApi } from "@/lib/api/dashboard";
import { formatCurrency } from "@/lib/shared";

type Props = {
  open: boolean;
  order: Order | null;
  busy?: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

export function EditOrderModal({ open, order, busy = false, onClose, onSaved }: Props) {
  const [orderStatus, setOrderStatus] = useState<Order["orderStatus"]>("pending");
  const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("cash");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (!order) return;
    setOrderStatus(order.orderStatus);
    setPaymentMethod(order.paymentMethod);
    setTableNumber(order.tableNumber ?? "");
    setDeliveryAddress(order.deliveryAddress ?? "");
    setCustomerName(order.customerName ?? "");
    setPhone(order.phone ?? "");
    setEmail(order.email ?? "");
  }, [order, open]);

  const orderType = useMemo(() => order?.orderType ?? "dine-in", [order]);

  const handleSave = async () => {
    if (!order) return;
    try {
      // Backend currently has updateOrderStatus wired; keep edit scope aligned.
      // If backend supports full update, extend here to call that endpoint.
      const targetId = order.backendId ?? order.id;
      await dashboardApi.updateOrderStatus(targetId, orderStatus);
      toast.success("Order updated");
      onSaved?.();
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to update order");
    }
  };

  return (
    <Modal open={open}>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Edit Order</h2>
            <p className="text-sm text-slate-500">{order ? `#${order.id}` : ""}</p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        {!order ? (
          <div className="text-sm text-slate-500">No order selected.</div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
              />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />

              <Select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as Order["orderStatus"])}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>

              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as Order["paymentMethod"])}
              >
                <option value="cash">Cash</option>
                <option value="eSewa">eSewa</option>
                <option value="Khalti">Khalti</option>
              </Select>

              <div className="rounded-2xl bg-brand-soft/30 p-3 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Items</p>
                <p className="mt-2 line-clamp-2 text-sm font-semibold text-brand-ink dark:text-white">
                  {order.itemsOrdered}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  Qty: {order.quantity}
                </p>
              </div>

              <div className="rounded-2xl bg-brand-soft/30 p-3 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total</p>
                <p className="mt-2 text-sm font-semibold text-brand-ink dark:text-white">
                  {formatCurrency(order.totalPrice)}
                </p>
              </div>
            </div>

            {orderType === "dine-in" && (
              <Input
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="T-01"
              />
            )}

            {orderType === "delivery" && (
              <Input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Delivery address"
              />
            )}

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={busy}>
                {busy ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

