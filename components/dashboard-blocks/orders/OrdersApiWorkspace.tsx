"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { useOrders } from "@/hooks/useOrders";
import { useRealtimeResourceRefresh } from "@/hooks/useRealtimeUpdates";
import type { Order } from "@/lib/shared";
import { dashboardApi } from "@/lib/api/dashboard";
import { extractList } from "@/services/api/http";

import { OrderFilters } from "./OrderFilters";
import { OrdersTable } from "./OrdersTable";
import { EditOrderModal } from "./EditOrderModal";

function normalizeCatalogItem(item: any) {
  return {
    id: item?.id ?? item?._id ?? "",
    name: item?.name ?? "Menu item",
    price: Number(item?.price ?? 0),
  };
}

export function OrdersApiWorkspace() {
  const [statusFilter, setStatusFilter] = useState<"all" | Order["orderStatus"]>("all");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const orders = useOrders();
  useRealtimeResourceRefresh(["orders"], orders.refresh);

  const catalogQuery = useQuery({
    queryKey: ["menu-items", "orders-catalog"],
    queryFn: async () => {
      const response = await dashboardApi.getMenuItems({ page: 1, limit: 100, available: true });
      return extractList<any>(response).map(normalizeCatalogItem).filter((item) => item.id);
    },
  });

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders.filteredOrders;
    return orders.filteredOrders.filter((entry) => entry.orderStatus === statusFilter);
  }, [orders.filteredOrders, statusFilter]);

  return (
    <div className="space-y-6">
      <ResourceNote error={orders.error || orders.mutationError} loading={orders.loading} fallbackLabel="orders" />

      <OrderFilters
        query={orders.query}
        status={statusFilter}
        onQueryChange={orders.setQuery}
        onStatusChange={setStatusFilter}
      />

      <OrdersTable
        data={filteredOrders}
        onStatusChange={orders.updateOrderStatus}
        onDelete={orders.deleteOrder}
        onEdit={(order) => {
          setEditingOrder(order);
          setEditModalOpen(true);
        }}
        busy={orders.mutating}
      />

      <EditOrderModal
        open={editModalOpen}
        order={editingOrder}
        busy={orders.mutating}
        onClose={() => setEditModalOpen(false)}
        onSaved={() => orders.refresh()}
      />
    </div>
  );
}
