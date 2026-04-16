"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useBackendResource } from "@/hooks/useBackendResource";
import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { orders as fallbackOrders } from "@/lib/mock-data";
import { findArrayData, normalizeOrder } from "@/lib/dashboard-normalizers";
import type { Order } from "@/lib/types";

type CreateOrderInput = {
  customerName: string;
  phone: string;
  email: string;
  itemName: string;
  quantity: number;
  orderType: Order["orderType"];
  paymentMethod: Order["paymentMethod"];
  tableNumber?: string;
  deliveryAddress?: string;
};

function mapOrderType(value: Order["orderType"]) {
  return value === "dine-in" ? "dine_in" : value;
}

export function useOrders() {
  const [query, setQuery] = useState("");

  const resource = useBackendResource<Order[]>({
    fallback: fallbackOrders,
    resetOnError: false,
    loader: async () => {
      const token = getAccessToken();
      const response: any = await dashboardApi.getOrders(token, { page: 1, limit: 50 });
      const items = findArrayData(response);
      return items ? items.map(normalizeOrder) : fallbackOrders;
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

  const createOrder = useCallback(
    async (payload: CreateOrderInput, price: number) => {
      const token = getAccessToken();
      const optimisticId = `JBB-${Math.floor(1000 + Math.random() * 9000)}`;
      const optimisticOrder: Order = {
        id: optimisticId,
        customerName: payload.customerName || "Walk-in Customer",
        phone: payload.phone || "-",
        email: payload.email || "-",
        itemsOrdered: payload.itemName,
        quantity: payload.quantity,
        totalPrice: price * payload.quantity,
        orderType: payload.orderType,
        paymentMethod: payload.paymentMethod,
        paymentStatus: payload.paymentMethod === "cash" ? "pending" : "paid",
        orderStatus: "pending",
        tableNumber: payload.orderType === "dine-in" ? payload.tableNumber : undefined,
        deliveryAddress: payload.orderType === "delivery" ? payload.deliveryAddress : undefined,
        createdTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timeline: [
          { label: "Pending", time: "Now", active: true },
          { label: "Confirmed", time: "--", active: false },
          { label: "Preparing", time: "--", active: false },
          { label: "Completed", time: "--", active: false },
        ],
      };

      await resource.runMutation(
        async () => {
          const body = {
            customerName: payload.customerName,
            phone: payload.phone,
            email: payload.email,
            items: [
              {
                name: payload.itemName,
                quantity: payload.quantity,
                price,
              },
            ],
            orderType: mapOrderType(payload.orderType),
            paymentMethod: payload.paymentMethod,
            ...(payload.orderType === "dine-in" ? { tableNumber: payload.tableNumber } : {}),
            ...(payload.orderType === "delivery" ? { deliveryAddress: payload.deliveryAddress } : {}),
          };

          const response: any = await dashboardApi.createOrder(body, token);
          return normalizeOrder(response?.data ?? response ?? body);
        },
        {
          optimisticData: (current) => [optimisticOrder, ...current],
          onSuccess: (created, current) => [created, ...current.filter((entry) => entry.id !== optimisticId)],
          onError: (error) => toast.error(error.message),
        }
      );

      toast.success("Order created");
    },
    [resource]
  );

  const updateOrderStatus = useCallback(
    async (order: Order, status: Order["orderStatus"]) => {
      const token = getAccessToken();
      const targetId = order.backendId ?? order.id;

      await resource.runMutation(
        async () => {
          const response: any = await dashboardApi.updateOrderStatus(targetId, token, status);
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

  const updateOrder = useCallback(
    async (order: Order, updates: Partial<Pick<Order, "customerName" | "phone" | "email">>) => {
      const token = getAccessToken();
      const targetId = order.backendId ?? order.id;

      await resource.runMutation(
        async () => {
          const response: any = await dashboardApi.updateOrder(targetId, token, updates);
          return normalizeOrder(response?.data ?? { ...order, ...updates });
        },
        {
          optimisticData: (current) => current.map((entry) => (entry.id === order.id ? { ...entry, ...updates } : entry)),
          onSuccess: (updated, current) => current.map((entry) => (entry.id === order.id ? { ...entry, ...updated } : entry)),
          onError: (error) => toast.error(error.message),
        }
      );

      toast.success("Order updated");
    },
    [resource]
  );

  const deleteOrder = useCallback(
    async (order: Order) => {
      const token = getAccessToken();
      const targetId = order.backendId ?? order.id;

      await resource.runMutation(
        () => dashboardApi.deleteOrder(targetId, token),
        {
          optimisticData: (current) => current.filter((entry) => entry.id !== order.id),
          onError: (error) => toast.error(error.message),
        }
      );

      toast.success("Order deleted");
    },
    [resource]
  );

  return {
    ...resource,
    query,
    setQuery,
    filteredOrders,
    createOrder,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
  };
}
