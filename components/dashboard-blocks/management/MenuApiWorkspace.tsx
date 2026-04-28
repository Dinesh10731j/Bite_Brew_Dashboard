"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlockCard, GenericTable } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";
import { Button } from "@/components/shared/ui/Button";
import { dashboardApi } from "@/lib/api/dashboard";
import { extractList } from "@/services/api/http";

type Category = {
  id: string;
  name: string;
};

type MenuItemRow = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  available: boolean;
  featured: boolean;
  discount: number;
  image: string;
};

function normalizeCategory(item: any): Category {
  return {
    id: item?.id ?? item?._id ?? "",
    name: item?.name ?? "Unnamed",
  };
}

function normalizeMenuItem(item: any): MenuItemRow {
  return {
    id: item?.id ?? item?._id ?? "",
    name: item?.name ?? "Menu Item",
    categoryId: item?.categoryId ?? item?.category?.id ?? item?.category?._id ?? "",
    categoryName: item?.category?.name ?? item?.categoryName ?? "Uncategorized",
    price: Number(item?.price ?? 0),
    available: item?.available !== false,
    featured: Boolean(item?.featured),
    discount: Number(item?.discount ?? 0),
    image: item?.image ?? "",
  };
}

export function MenuApiWorkspace() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    categoryId: "",
    price: "",
    discount: "0",
    description: "",
  });
  const [itemImage, setItemImage] = useState<File | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["menu-categories"],
    queryFn: async () => {
      const response = await dashboardApi.getMenuCategories({ page: 1, limit: 100 });
      return extractList<any>(response).map(normalizeCategory);
    },
  });

  const itemsQuery = useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const response = await dashboardApi.getMenuItems({ page: 1, limit: 100 });
      return extractList<any>(response).map(normalizeMenuItem);
    },
  });

  const categoryCreateMutation = useMutation({
    mutationFn: async (name: string) => {
      await dashboardApi.createMenuCategory({ name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
      setNewCategoryName("");
    },
  });

  const categoryDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await dashboardApi.deleteMenuCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async () => {
      let uploadedImage = "";
      if (itemImage) {
        const uploadResponse: any = await dashboardApi.uploadImage(itemImage, "menu");
        uploadedImage =
          uploadResponse?.data?.url ??
          uploadResponse?.url ??
          uploadResponse?.data?.imageUrl ??
          "";
      }

      await dashboardApi.createMenuItem({
        name: newItem.name,
        categoryId: newItem.categoryId,
        price: Number(newItem.price),
        description: newItem.description,
        discount: Number(newItem.discount),
        available: true,
        featured: false,
        ...(uploadedImage ? { image: uploadedImage } : {}),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      setNewItem({ name: "", categoryId: "", price: "", discount: "0", description: "" });
      setItemImage(null);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<MenuItemRow> }) => {
      await dashboardApi.updateMenuItem(id, patch);
      return { id, patch };
    },
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: ["menu-items"] });
      const previous = queryClient.getQueryData<MenuItemRow[]>(["menu-items"]);
      queryClient.setQueryData<MenuItemRow[]>(["menu-items"], (current = []) =>
        current.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry))
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["menu-items"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await dashboardApi.deleteMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });

  const categories = categoriesQuery.data ?? [];
  const items = itemsQuery.data ?? [];

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return items;
    return items.filter((item) => item.categoryId === selectedCategory || item.categoryName === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="space-y-6">
      <ResourceNote
        error={
          (categoriesQuery.error instanceof Error ? categoriesQuery.error.message : "") ||
          (itemsQuery.error instanceof Error ? itemsQuery.error.message : "")
        }
        loading={categoriesQuery.isLoading || itemsQuery.isLoading}
        fallbackLabel="menu"
      />

      <BlockCard title="Categories" description="Create and delete menu categories.">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            placeholder="New category name"
          />
          <Button
            onClick={() => void categoryCreateMutation.mutateAsync(newCategoryName)}
            disabled={!newCategoryName.trim()}
          >
            Add Category
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2 rounded-xl border border-brand/15 px-3 py-2">
              <span className="text-sm text-brand-ink dark:text-white">{category.name}</span>
              <button
                onClick={() => void categoryDeleteMutation.mutateAsync(category.id)}
                className="text-xs text-rose-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </BlockCard>

      <BlockCard title="Create Menu Item" description="Upload image and create a menu item.">
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            value={newItem.name}
            onChange={(event) => setNewItem((current) => ({ ...current, name: event.target.value }))}
            placeholder="Item name"
          />
          <Select
            value={newItem.categoryId}
            onChange={(event) => setNewItem((current) => ({ ...current, categoryId: event.target.value }))}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input
            value={newItem.price}
            onChange={(event) => setNewItem((current) => ({ ...current, price: event.target.value }))}
            placeholder="Price"
            type="number"
          />
          <Input
            value={newItem.discount}
            onChange={(event) => setNewItem((current) => ({ ...current, discount: event.target.value }))}
            placeholder="Discount"
            type="number"
          />
          <Input
            value={newItem.description}
            onChange={(event) => setNewItem((current) => ({ ...current, description: event.target.value }))}
            placeholder="Description"
            className="md:col-span-2"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(event) => setItemImage(event.target.files?.[0] ?? null)}
            className="md:col-span-2"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => void createItemMutation.mutateAsync()}
            disabled={!newItem.name || !newItem.categoryId || !newItem.price}
          >
            Save Item
          </Button>
        </div>
      </BlockCard>

      <BlockCard title="Filter" description="Filter items by category.">
        <Select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </BlockCard>

      <GenericTable
        title="Menu Items"
        description="Toggle availability, featured status, discount, and delete items."
        headers={["Name", "Category", "Price", "Availability", "Featured", "Discount", "Actions"]}
        rows={filteredItems.map((item) => [
          item.name,
          item.categoryName,
          `NPR ${item.price.toLocaleString()}`,
          <Select
            key={`${item.id}-available`}
            value={String(item.available)}
            onChange={(event) =>
              void updateItemMutation.mutateAsync({ id: item.id, patch: { available: event.target.value === "true" } })
            }
            className="py-2 text-xs"
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </Select>,
          <Select
            key={`${item.id}-featured`}
            value={String(item.featured)}
            onChange={(event) =>
              void updateItemMutation.mutateAsync({ id: item.id, patch: { featured: event.target.value === "true" } })
            }
            className="py-2 text-xs"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </Select>,
          <Input
            key={`${item.id}-discount`}
            defaultValue={String(item.discount)}
            type="number"
            className="w-24 py-2 text-xs"
            onBlur={(event) =>
              void updateItemMutation.mutateAsync({
                id: item.id,
                patch: { discount: Number(event.target.value || 0) },
              })
            }
          />,
          <Button
            key={`${item.id}-delete`}
            variant="danger"
            className="px-3 py-2 text-xs"
            onClick={() => void deleteItemMutation.mutateAsync(item.id)}
          >
            Delete
          </Button>,
        ])}
      />
    </div>
  );
}