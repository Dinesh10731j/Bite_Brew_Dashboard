"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlockCard, GenericTable } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { Input } from "@/components/shared/ui/Input";
import { Select } from "@/components/shared/ui/Select";
import { Button } from "@/components/shared/ui/Button";
import { dashboardApi } from "@/lib/api/dashboard";
import { extractList } from "@/services/api/http";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  updatedAt: string;
};

function normalizeUser(item: any): UserRow {
  const roleRaw = String(item?.role ?? "user").toLowerCase();
  const role = roleRaw === "admin" ? "admin" : roleRaw === "manager" ? "manager" : "user";

  return {
    id: item?.id ?? item?._id ?? "",
    name: item?.name ?? "User",
    email: item?.email ?? "-",
    role,
    updatedAt: item?.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-",
  };
}

export function UsersApiWorkspace() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const usersQuery = useQuery<UserRow[]>({
    queryKey: ["users", page, search],
    queryFn: async () => {
      const response = await dashboardApi.getUsers({ page, limit: 10, search: search || undefined });
      return extractList<any>(response).map(normalizeUser);
    },
    placeholderData: keepPreviousData,
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: "admin" | "manager" | "user" }) => {
      await dashboardApi.updateUserRole(id, role);
      return { id, role };
    },
    onMutate: async ({ id, role }) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousEntries = queryClient.getQueriesData<UserRow[]>({ queryKey: ["users"] });
      previousEntries.forEach(([key, rows]) => {
        queryClient.setQueryData<UserRow[]>(key, (current = rows ?? []) =>
          current.map((entry) => (entry.id === id ? { ...entry, role } : entry))
        );
      });
      return { previousEntries };
    },
    onError: (_error, _variables, context) => {
      context?.previousEntries?.forEach(([key, rows]) => {
        queryClient.setQueryData(key, rows);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const rows = usersQuery.data ?? [];

  const tableRows = useMemo(
    () =>
      rows.map((user) => [
        user.name,
        user.email,
        <Select
          key={`${user.id}-role`}
          value={user.role}
          onChange={(event) =>
            void roleMutation.mutateAsync({ id: user.id, role: event.target.value as "admin" | "manager" | "user" })
          }
          className="py-2 text-xs"
        >
          <option value="admin">admin</option>
          <option value="manager">manager</option>
          <option value="user">user</option>
        </Select>,
        user.updatedAt,
      ]),
    [rows, roleMutation]
  );

  return (
    <div className="space-y-6">
      <ResourceNote
        error={usersQuery.error instanceof Error ? usersQuery.error.message : ""}
        loading={usersQuery.isLoading}
        fallbackLabel="users"
      />

      <BlockCard title="User Management" description="Search users and update role assignments.">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email"
          />
          <Button variant="secondary" onClick={() => setPage((current) => Math.max(1, current - 1))}>
            Prev
          </Button>
          <Button onClick={() => setPage((current) => current + 1)}>Next</Button>
        </div>
      </BlockCard>

      <GenericTable
        title="Users"
        description="Paginated users list with role update controls."
        headers={["Name", "Email", "Role", "Updated"]}
        rows={tableRows}
      />
    </div>
  );
}