"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { useOrders } from "@/hooks/useOrders";
import { useRealtimeResourceRefresh } from "@/hooks/useRealtimeUpdates";
import type { Order } from "@/lib/types";
import { dashboardApi } from "@/lib/api/dashboard";
import { extractList } from "@/services/api/http";

//import { AddOrderForm, type CreateOrderPayload } from "./AddOrderForm";
import { OrderFilters } from "./OrderFilters";
import { OrdersTable } from "./OrdersTable";

function normalizeCatalogItem(item: any) {
  return {
    id: item?.id ?? item?._id ?? "",
    name: item?.name ?? "Menu item",
    price: Number(item?.price ?? 0),
  };
}

export function OrdersApiWorkspace() {
  const [statusFilter, setStatusFilter] = useState<"all" | Order["orderStatus"]>("all");

  const orders = useOrders();
  useRealtimeResourceRefresh(["orders"], orders.refresh);

  const catalogQuery = useQuery({
    queryKey: ["menu-items", "orders-catalog"],
    queryFn: async () => {
      const response = await dashboardApi.getMenuItems({ page: 1, limit: 100, available: true });
      return extractList<any>(response).map(normalizeCatalogItem).filter((item) => item.id);
    },
  });

  // const createOrderMutation = useMutation({
  //   mutationFn: async (payload: CreateOrderPayload) => {
  //     await dashboardApi.createOrder({
  //       customerName: payload.customerName,
  //       phone: payload.phone,
  //       email: payload.email,
  //       tableNumber: payload.tableNumber,
  //       deliveryAddress: payload.deliveryAddress,
  //       orderType: payload.orderType,
  //       paymentMethod: payload.paymentMethod,
  //       items: [{ menuItemId: payload.menuItemId, quantity: payload.quantity }],
  //     });
  //   },
  //   onSuccess: async () => {
  //     await orders.refresh();
  //   },
  // });

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders.filteredOrders;
    return orders.filteredOrders.filter((entry) => entry.orderStatus === statusFilter);
  }, [orders.filteredOrders, statusFilter]);

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

      {/* <AddOrderForm
        catalog={catalogQuery.data ?? []}
        loading={createOrderMutation.isPending}
        onAdd={(payload) => createOrderMutation.mutateAsync(payload)}
      /> */}

      <OrdersTable
        data={filteredOrders}
        onStatusChange={orders.updateOrderStatus}
        busy={orders.mutating}
      />
    </div>
  );
}
