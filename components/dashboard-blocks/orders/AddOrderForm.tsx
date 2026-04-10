"use client";

import { useState } from "react";
import type { Order } from "@/lib/types";
import { menuItems } from "@/lib/mock-data";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";

type AddOrderFormProps = {
  catalog: { id: string; name: string; price: number }[];
  onAdd: (order: Order) => Promise<void> | void;
};

export function AddOrderForm({ catalog, onAdd }: AddOrderFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedItem, setSelectedItem] = useState(catalog[0]?.name ?? menuItems[0]?.name ?? "");
  const [quantity, setQuantity] = useState("1");
  const [orderType, setOrderType] = useState<Order["orderType"]>("dine-in");
  const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("cash");
  const [tableNumber, setTableNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const item =
      catalog.find((menuItem) => menuItem.name === selectedItem) ??
      menuItems.find((menuItem) => menuItem.name === selectedItem) ??
      menuItems[0];
    const qty = Number(quantity) || 1;
    const createdOrder: Order = {
      id: `JBB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || "Walk-in Customer",
      phone: phone || "-",
      email: email || "-",
      itemsOrdered: item.name,
      quantity: qty,
      totalPrice: item.price * qty,
      orderType,
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
      orderStatus: "pending",
      tableNumber: orderType === "dine-in" ? tableNumber || "T-01" : undefined,
      deliveryAddress: orderType === "delivery" ? deliveryAddress || "Address not set" : undefined,
      createdTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeline: [
        { label: "Pending", time: "Now", active: true },
        { label: "Confirmed", time: "--", active: false },
        { label: "Preparing", time: "--", active: false },
        { label: "Completed", time: "--", active: false }
      ]
    };

    await onAdd(createdOrder);
    setMessage(`Added ${createdOrder.id} for ${createdOrder.customerName}.`);
    setCustomerName("");
    setPhone("");
    setEmail("");
    setQuantity("1");
    setTableNumber("");
    setDeliveryAddress("");
  };

  return (
    <BlockCard
      title="Add Order"
      description="Create a frontend demo order and show it instantly in the orders table."
      action={<Button onClick={handleSubmit}>Add Order</Button>}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Input placeholder="Customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <Input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
          {catalog.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </Select>
        <Input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <Select value={orderType} onChange={(e) => setOrderType(e.target.value as Order["orderType"])}>
          <option value="dine-in">Dine-in</option>
          <option value="takeaway">Takeaway</option>
          <option value="delivery">Delivery</option>
        </Select>
        <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as Order["paymentMethod"])}>
          <option value="cash">Cash</option>
          <option value="eSewa">eSewa</option>
          <option value="Khalti">Khalti</option>
        </Select>
        {orderType === "dine-in" && (
          <Input placeholder="Table number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
        )}
        {orderType === "delivery" && (
          <Input
            placeholder="Delivery address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="md:col-span-2"
          />
        )}
      </div>
      <div className="rounded-2xl bg-brand-soft/50 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-200">
        New orders appear instantly in the table below. To change the default demo data permanently, edit
        ` frontend/lib/mock-data.ts`.
      </div>
      {message && <div className="text-sm font-medium text-brand">{message}</div>}
    </BlockCard>
  );
}
