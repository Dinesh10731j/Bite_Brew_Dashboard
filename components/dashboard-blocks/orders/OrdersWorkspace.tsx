"use client";

import { useState } from "react";
import type { Order } from "@/lib/types";
import { menuItems, orders as initialOrders } from "@/lib/mock-data";
import { AddOrderForm } from "./AddOrderForm";
import { OrderFilters } from "./OrderFilters";
import { OrdersTable } from "./OrdersTable";

export function OrdersWorkspace() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  return (
    <div className="space-y-6">
      <AddOrderForm
        catalog={menuItems.map((item) => ({ id: item.id, name: item.name, price: item.price }))}
        onAdd={(order) => setOrders((current) => [order, ...current])}
      />
      <OrderFilters />
      <OrdersTable data={orders} />
    </div>
  );
}
