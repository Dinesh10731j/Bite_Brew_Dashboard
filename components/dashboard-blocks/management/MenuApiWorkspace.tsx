"use client";

import type { MenuItem } from "@/lib/types";
import { dashboardApi } from "@/lib/api/dashboard";
import { menuItems as fallbackItems } from "@/lib/mock-data";
import { useBackendResource } from "@/hooks/useBackendResource";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { MenuForm } from "./MenuForm";
import { MenuItem as MenuItemsGrid } from "./MenuItem";

function normalizeMenuItem(item: any): MenuItem {
  return {
    id: item?.id ?? item?._id ?? item?.name ?? "menu-item",
    name: item?.name ?? "Menu item",
    category: item?.category?.name ?? item?.categoryName ?? item?.category ?? "Coffee",
    price: Number(item?.price ?? 0),
    description: item?.description ?? "",
    availability: item?.available === false ? "out of stock" : "in stock",
    image: item?.image ?? fallbackItems[0]?.image ?? "",
    featured: Boolean(item?.featured),
    discount: item?.discount ? String(item.discount) : undefined,
    popularity: Number(item?.ordersCount ?? item?.popularity ?? 0)
  };
}

export function MenuApiWorkspace() {
  const resource = useBackendResource<MenuItem[]>(fallbackItems, async () => {
    const response: any = await dashboardApi.getMenuItems({ page: 1, limit: 50 });
    const items = response?.data ?? [];
    return Array.isArray(items) ? items.map(normalizeMenuItem) : fallbackItems;
  });

  return (
    <div className="space-y-6">
      <ResourceNote error={resource.error} loading={resource.loading} fallbackLabel="menu" />
      <MenuForm />
      <MenuItemsGrid items={resource.data} />
    </div>
  );
}
