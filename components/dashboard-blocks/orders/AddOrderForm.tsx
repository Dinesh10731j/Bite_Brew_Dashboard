"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order } from "@/lib/types";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";

export type CreateOrderPayload = {
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

type AddOrderFormProps = {
  catalog: { id: string; name: string; price: number }[];
  loading?: boolean;
  onAdd: (payload: CreateOrderPayload, price: number) => Promise<void> | void;
};

export function AddOrderForm({ catalog, onAdd, loading = false }: AddOrderFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedItem, setSelectedItem] = useState(catalog[0]?.name ?? "");
  const [quantity, setQuantity] = useState("1");
  const [orderType, setOrderType] = useState<Order["orderType"]>("dine-in");
  const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("cash");
  const [tableNumber, setTableNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const selectedCatalogItem = useMemo(
    () => catalog.find((entry) => entry.name === selectedItem) ?? catalog[0],
    [catalog, selectedItem]
  );

  useEffect(() => {
    if (!selectedItem && catalog[0]?.name) {
      setSelectedItem(catalog[0].name);
    }
  }, [catalog, selectedItem]);

  const handleSubmit = async () => {
    if (!selectedCatalogItem) return;

    const qty = Number(quantity) || 1;
    const payload: CreateOrderPayload = {
      customerName: customerName || "Walk-in Customer",
      phone: phone || "-",
      email: email || "-",
      itemName: selectedCatalogItem.name,
      quantity: qty,
      orderType,
      paymentMethod,
      tableNumber: orderType === "dine-in" ? tableNumber || "T-01" : undefined,
      deliveryAddress: orderType === "delivery" ? deliveryAddress || "Address not set" : undefined,
    };

    await onAdd(payload, selectedCatalogItem.price);
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
      description="Create an order and sync it with backend instantly."
      action={
        <Button onClick={handleSubmit} disabled={loading || !selectedCatalogItem}>
          {loading ? "Saving..." : "Add Order"}
        </Button>
      }
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
    </BlockCard>
  );
}
