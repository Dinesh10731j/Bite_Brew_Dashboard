"use client";

import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";

type Props = {
  query: string;
  readFilter: "all" | "read" | "unread";
  onQueryChange: (value: string) => void;
  onReadFilterChange: (value: "all" | "read" | "unread") => void;
};

export function MessageFilters({ query, readFilter, onQueryChange, onReadFilterChange }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search by sender, contact, content, source"
      />
      <Select value={readFilter} onChange={(event) => onReadFilterChange(event.target.value as Props["readFilter"])}>
        <option value="all">All messages</option>
        <option value="read">Read only</option>
        <option value="unread">Unread only</option>
      </Select>
    </div>
  );
}
