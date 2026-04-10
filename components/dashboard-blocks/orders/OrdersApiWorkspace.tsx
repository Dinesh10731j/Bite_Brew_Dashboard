"use client";

import { useMemo } from "react";
import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { menuItems as fallbackMenuItems, orders as fallbackOrders } from "@/lib/mock-data";
import type { Order } from "@/lib/types";
import { useBackendResource } from "@/hooks/useBackendResource";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { AddOrderForm } from "./AddOrderForm";
import { OrderFilters } from "./OrderFilters";
import { OrdersTable } from "./OrdersTable";

type OrderCatalogItem = {
  id: string;
  name: string;
  price: number;
};

function normalizeOrder(item: any): Order {
  const status = item?.status ?? item?.orderStatus ?? "pending";
  const paymentMethod = item?.paymentMethod ?? "cash";
  const totalPrice =
    Number(item?.totalPrice ?? item?.total ?? item?.amount ?? 0) ||
    (Array.isArray(item?.items) ? item.items.reduce((sum: number, part: any) => sum + Number(part?.price ?? 0) * Number(part?.quantity ?? 1), 0) : 0);

  return {
    id: item?.orderNumber ?? item?.id ?? item?._id ?? "JBB-0000",
    customerName: item?.customerName ?? "Customer",
    phone: item?.phone ?? "-",
    email: item?.email ?? "-",
    itemsOrdered:
      item?.itemsOrdered ??
      (Array.isArray(item?.items) ? item.items.map((part: any) => part?.menuItem?.name ?? part?.name ?? "Item").join(", ") : "Order item"),
    quantity: Number(item?.quantity ?? (Array.isArray(item?.items) ? item.items.reduce((sum: number, part: any) => sum + Number(part?.quantity ?? 1), 0) : 1)),
    totalPrice,
    orderType: item?.orderType ?? "takeaway",
    paymentMethod,
    paymentStatus: item?.paymentStatus ?? (paymentMethod === "cash" ? "pending" : "paid"),
    orderStatus: status === "ready" || status === "cancelled" ? "confirmed" : status,
    tableNumber: item?.tableNumber,
    deliveryAddress: item?.deliveryAddress,
    createdTime: item?.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-",
    timeline: [
      { label: "Pending", time: item?.createdAt ? "Created" : "--", active: true },
      { label: "Confirmed", time: status === "confirmed" || status === "preparing" || status === "completed" ? "Updated" : "--", active: ["confirmed", "preparing", "completed"].includes(status) },
      { label: "Preparing", time: status === "preparing" || status === "completed" ? "Kitchen" : "--", active: ["preparing", "completed"].includes(status) },
      { label: "Completed", time: status === "completed" ? "Done" : "--", active: status === "completed" }
    ]
  };
}

function normalizeMenuItem(item: any): OrderCatalogItem {
  return {
    id: item?.id ?? item?._id ?? item?.name,
    name: item?.name ?? "Menu item",
    price: Number(item?.price ?? 0)
  };
}

export function OrdersApiWorkspace() {
  const token = getAccessToken();

  const ordersResource = useBackendResource<Order[]>(fallbackOrders, async () => {
    if (!token) {
      return fallbackOrders;
    }

    const response: any = await dashboardApi.getOrders(token, { page: 1, limit: 20 });
    const items = response?.data ?? [];
    return Array.isArray(items) ? items.map(normalizeOrder) : fallbackOrders;
  });

  const menuResource = useBackendResource<OrderCatalogItem[]>(
    fallbackMenuItems.map((item) => ({ id: item.id, name: item.name, price: item.price })),
    async () => {
      const response: any = await dashboardApi.getMenuItems({ page: 1, limit: 50 });
      const items = response?.data ?? [];
      return Array.isArray(items)
        ? items.map(normalizeMenuItem)
        : fallbackMenuItems.map((item) => ({ id: item.id, name: item.name, price: item.price }));
    }
  );

  const catalog = useMemo(() => menuResource.data, [menuResource.data]);

  return (
    <div className="space-y-6">
      <ResourceNote error={ordersResource.error} loading={ordersResource.loading} fallbackLabel="orders" />
      <AddOrderForm
        catalog={catalog}
        onAdd={async (order) => {
          if (token) {
            const selected = catalog.find((item) => item.name === order.itemsOrdered);

            if (selected) {
              await dashboardApi.createOrder(
                {
                  customerName: order.customerName,
                  phone: order.phone !== "-" ? order.phone : undefined,
                  email: order.email !== "-" ? order.email : undefined,
                  items: [{ menuItemId: selected.id, quantity: order.quantity }],
                  tableNumber: order.tableNumber,
                  deliveryAddress: order.deliveryAddress,
                  orderType: order.orderType,
                  paymentMethod: order.paymentMethod
                },
                token
              );
              await ordersResource.refresh();
              return;
            }
          }

          ordersResource.setData((current) => [order, ...current]);
        }}
      />
      <OrderFilters />
      <OrdersTable data={ordersResource.data} />
    </div>
  );
}
