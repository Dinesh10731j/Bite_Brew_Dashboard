"use client";

import { dashboardApi } from "@/lib/api/dashboard";
import { getAccessToken } from "@/lib/auth";
import { useBackendResource } from "@/hooks/useBackendResource";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { UserForm } from "./UserForm";
import { UsersList } from "./UsersList";

const fallbackUsers = [
  ["Aarav Admin", "admin", "Full access", "Today 09:10"],
  ["Mina Staff", "staff", "Orders, messages", "Today 08:22"],
  ["Rajan Ops", "manager", "Operations, reports", "Yesterday 18:45"]
];

export function UsersApiWorkspace() {
  const resource = useBackendResource<string[][]>({
    fallback: fallbackUsers,
    loader: async () => {
      const token = getAccessToken();
      const response: any = await dashboardApi.getUsers(token, { page: 1, limit: 20 });
      const items = response?.data ?? [];
      return Array.isArray(items)
        ? items.map((item: any) => [
            item?.name ?? "User",
            item?.role ?? "user",
            item?.role === "admin" ? "Full access" : item?.role === "manager" ? "Operational access" : "Basic access",
            item?.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"
          ])
        : fallbackUsers;
    },
    resetOnError: false,
  });

  return (
    <div className="space-y-6">
      <ResourceNote error={resource.error} loading={resource.loading} fallbackLabel="users" />
      <UsersList rows={resource.data} />
      <UserForm />
    </div>
  );
}
