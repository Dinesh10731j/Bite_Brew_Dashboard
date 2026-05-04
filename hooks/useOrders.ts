"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { findArrayData, normalizeOrder } from "@/lib/dashboard-normalizers";
import type { Order } from "@/lib/types";

export function useOrders() {
  const [query, setQuery] = useState("");

  const resource = useBackendResource<Order[]>({
    fallback: [],
    resetOnError: true,
    loader: async () => {
      const response: any = await dashboardApi.getOrders({ page: 1, limit: 50 });
      const items = findArrayData(response);
      return items ? items.map(normalizeOrder) : [];
    },
  });

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return resource.data;

    return resource.data.filter((order) => {
      return [order.id, order.customerName, order.phone, order.itemsOrdered, order.orderStatus]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, resource.data]);

  const updateOrderStatus = useCallback(
    async (order: Order, status: Order["orderStatus"]) => {
      const targetId = order.backendId ?? order.id;

      await resource.runMutation(
        async () => {
          const response: any = await dashboardApi.updateOrderStatus(targetId, status);
          return normalizeOrder(response?.data ?? { ...order, status });
        },
        {
          optimisticData: (current) => current.map((entry) => (entry.id === order.id ? { ...entry, orderStatus: status } : entry)),
          onSuccess: (updated, current) => current.map((entry) => (entry.id === order.id ? { ...entry, ...updated } : entry)),
          onError: (error) => toast.error(error.message),
        }
      );

      toast.success("Order status updated");
    },
    [resource]
  );

  return {
    ...resource,
    query,
    setQuery,
    filteredOrders,
    updateOrderStatus,
  };
}
