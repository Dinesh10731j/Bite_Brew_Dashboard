"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order } from "@/lib/shared";
import { BlockCard } from "@/components/dashboard-blocks/common";
import { Button } from "@/components/shared/ui/Button";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";

export type CreateOrderPayload = {
  customerName: string;
  phone: string;
  email: string;
  menuItemId: string;
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
  const [selectedItemId, setSelectedItemId] = useState(catalog[0]?.id ?? "");
  const [quantity, setQuantity] = useState("1");
  const [orderType, setOrderType] = useState<Order["orderType"]>("dine-in");
  const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("cash");
  const [tableNumber, setTableNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const selectedCatalogItem = useMemo(
    () => catalog.find((entry) => entry.id === selectedItemId) ?? catalog[0],
    [catalog, selectedItemId]
  );

  useEffect(() => {
    if (!selectedItemId && catalog[0]?.id) {
      setSelectedItemId(catalog[0].id);
    }
  }, [catalog, selectedItemId]);

  const handleSubmit = async () => {
    if (!selectedCatalogItem) return;

    const qty = Number(quantity) || 1;
    const payload: CreateOrderPayload = {
      customerName: customerName || "Walk-in Customer",
      phone: phone || "-",
      email: email || "-",
      menuItemId: selectedCatalogItem.id,
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
        <Input placeholder="Customer name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
        <Input placeholder="Phone number" value={phone} onChange={(event) => setPhone(event.target.value)} />
        <Input placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Select value={selectedItemId} onChange={(event) => setSelectedItemId(event.target.value)}>
          {catalog.map((item, index) => (
            <option key={`${item.id}-${index}`} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
        <Input placeholder="Quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
        <Select value={orderType} onChange={(event) => setOrderType(event.target.value as Order["orderType"])}>
          <option value="dine-in">Dine-in</option>
          <option value="takeaway">Takeaway</option>
          <option value="delivery">Delivery</option>
        </Select>
        <Select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as Order["paymentMethod"])}>
          <option value="cash">Cash</option>
          <option value="eSewa">eSewa</option>
          <option value="Khalti">Khalti</option>
        </Select>
        {orderType === "dine-in" && (
          <Input placeholder="Table number" value={tableNumber} onChange={(event) => setTableNumber(event.target.value)} />
        )}
        {orderType === "delivery" && (
          <Input
            placeholder="Delivery address"
            value={deliveryAddress}
            onChange={(event) => setDeliveryAddress(event.target.value)}
            className="md:col-span-2"
          />
        )}
      </div>
    </BlockCard>
  );
}
