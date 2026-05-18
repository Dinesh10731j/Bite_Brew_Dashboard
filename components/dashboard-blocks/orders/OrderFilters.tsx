"use client";

import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";
import type { Order } from "@/lib/shared";

type Props = {
  query: string;
  status: "all" | Order["orderStatus"];
  onQueryChange: (value: string) => void;
  onStatusChange: (value: "all" | Order["orderStatus"]) => void;
};

export function OrderFilters({ query, status, onQueryChange, onStatusChange }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search by order, customer, phone, or item"
      />
      <Select value={status} onChange={(event) => onStatusChange(event.target.value as Props["status"])}>
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="preparing">Preparing</option>
        <option value="ready">Ready</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </Select>
    </div>
  );
}
