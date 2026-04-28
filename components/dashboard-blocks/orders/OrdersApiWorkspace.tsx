"use client";

import { useMemo, useState } from "react";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { useOrders } from "@/hooks/useOrders";
import { Modal } from "@/components/shared/ui/Modal";
import { Input } from "@/components/shared/ui/Input";
import { Button } from "@/components/shared/ui/Button";
import type { Order } from "@/lib/types";

import { OrderFilters } from "./OrderFilters";
import { OrdersTable } from "./OrdersTable";

export function OrdersApiWorkspace() {
  const [statusFilter, setStatusFilter] = useState<"all" | Order["orderStatus"]>("all");
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const orders = useOrders();

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders.filteredOrders;
    return orders.filteredOrders.filter((entry) => entry.orderStatus === statusFilter);
  }, [orders.filteredOrders, statusFilter]);

  const openEdit = (order: Order) => {
    setEditOrder(order);
    setEditName(order.customerName);
    setEditPhone(order.phone);
    setEditEmail(order.email);
  };

  return (
    <div className="space-y-6">
      <ResourceNote
        error={orders.error || orders.mutationError}
        loading={orders.loading}
        fallbackLabel="orders"
      />

      <OrderFilters
        query={orders.query}
        status={statusFilter}
        onQueryChange={orders.setQuery}
        onStatusChange={setStatusFilter}
      />

      <OrdersTable
        data={filteredOrders}
        onEdit={openEdit}
        onStatusChange={orders.updateOrderStatus}
        busy={orders.mutating}
      />

      <Modal open={Boolean(editOrder)}>
        {editOrder && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-ink dark:text-white">Edit Order {editOrder.id}</h3>
            <Input value={editName} onChange={(event) => setEditName(event.target.value)} placeholder="Customer name" />
            <Input value={editPhone} onChange={(event) => setEditPhone(event.target.value)} placeholder="Phone" />
            <Input value={editEmail} onChange={(event) => setEditEmail(event.target.value)} placeholder="Email" />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setEditOrder(null)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await orders.updateOrder(editOrder, {
                    customerName: editName,
                    phone: editPhone,
                    email: editEmail,
                  });
                  setEditOrder(null);
                }}
                disabled={orders.mutating}
              >
                {orders.mutating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}