"use client";

import { useMemo, useState } from "react";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { useBackendResource } from "@/hooks/useBackendResource";
import { useOrders } from "@/hooks/useOrders";
import { dashboardApi } from "@/lib/api/dashboard";
import { findArrayData } from "@/lib/dashboard-normalizers";
import { menuItems as fallbackMenuItems } from "@/lib/mock-data";
import { Modal } from "@/components/shared/ui/Modal";
import { Input } from "@/components/shared/ui/Input";
import { Button } from "@/components/shared/ui/Button";
import type { Order } from "@/lib/types";
import { AddOrderForm, type CreateOrderPayload } from "./AddOrderForm";
import { OrderFilters } from "./OrderFilters";
import { OrdersTable } from "./OrdersTable";

type OrderCatalogItem = {
  id: string;
  name: string;
  price: number;
};

function normalizeMenuItem(item: any): OrderCatalogItem {
  return {
    id: item?.id ?? item?._id ?? item?.name,
    name: item?.name ?? "Menu item",
    price: Number(item?.price ?? 0),
  };
}

export function OrdersApiWorkspace() {
  const [statusFilter, setStatusFilter] = useState<"all" | Order["orderStatus"]>("all");
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const orders = useOrders();

  const menuResource = useBackendResource<OrderCatalogItem[]>({
    fallback: fallbackMenuItems.map((item) => ({ id: item.id, name: item.name, price: item.price })),
    loader: async () => {
      const response: any = await dashboardApi.getMenuItems({ page: 1, limit: 50 });
      const items = findArrayData(response);
      return items
        ? items.map(normalizeMenuItem)
        : fallbackMenuItems.map((item) => ({ id: item.id, name: item.name, price: item.price }));
    },
    resetOnError: false,
  });

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders.filteredOrders;
    return orders.filteredOrders.filter((entry) => entry.orderStatus === statusFilter);
  }, [orders.filteredOrders, statusFilter]);

  const onCreate = async (payload: CreateOrderPayload, price: number) => {
    await orders.createOrder(payload, price);
  };

  const openEdit = (order: Order) => {
    setEditOrder(order);
    setEditName(order.customerName);
    setEditPhone(order.phone);
    setEditEmail(order.email);
  };

  return (
    <div className="space-y-6">
      <ResourceNote
        error={orders.error || orders.mutationError || menuResource.error}
        loading={orders.loading || menuResource.loading}
        fallbackLabel="orders"
      />

      <AddOrderForm catalog={menuResource.data} onAdd={onCreate} loading={orders.mutating} />

      <OrderFilters
        query={orders.query}
        status={statusFilter}
        onQueryChange={orders.setQuery}
        onStatusChange={setStatusFilter}
      />

      <OrdersTable
        data={filteredOrders}
        onEdit={openEdit}
        onDelete={(order) => setDeleteOrder(order)}
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

      <Modal open={Boolean(deleteOrder)}>
        {deleteOrder && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-ink dark:text-white">Delete {deleteOrder.id}?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              This action cannot be undone. The order will be removed from UI instantly and synced with backend.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteOrder(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  await orders.deleteOrder(deleteOrder);
                  setDeleteOrder(null);
                }}
                disabled={orders.mutating}
              >
                {orders.mutating ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
