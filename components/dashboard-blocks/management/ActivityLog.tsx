"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GenericTable } from "@/components/dashboard-blocks/common";
import { ResourceNote } from "@/components/dashboard/ResourceNote";
import { Empty } from "@/components/shared/ui/Empty";
import { dashboardApi } from "@/lib/api/dashboard";
import { extractList } from "@/services/api/http";

type ActivityLogRow = {
  id: string;
  user: string;
  action: string;
  module: string;
  time: string;
};

type PaginationMeta = {
  page: number;
  totalPages: number;
};

function getValue(source: any, keys: string[], fallback = "-") {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value);
  }
  return fallback;
}

function formatTime(value: unknown) {
  if (!value) return "-";

  const raw = String(value);
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function normalizeActivityLog(item: any, index: number): ActivityLogRow {
  const userObject = item?.user ?? item?.staff ?? item?.actor ?? item?.admin;
  const user =
    getValue(item, ["userName", "staffName", "actorName", "name"], "") ||
    getValue(userObject, ["name", "email"], "Unknown user");

  return {
    id: getValue(item, ["id", "_id"], `activity-${index}`),
    user,
    action: getValue(item, ["action", "activity", "event", "description", "message"]),
    module: getValue(item, ["module", "resource", "entity", "scope"], "System"),
    time: formatTime(item?.createdAt ?? item?.updatedAt ?? item?.time ?? item?.timestamp),
  };
}

function extractPagination(payload: any, page: number): PaginationMeta {
  const pagination = payload?.pagination ?? payload?.data?.pagination ?? {};
  const totalPages = Number(
    pagination?.totalPages ??
      pagination?.pages ??
      pagination?.totalPage ??
      Math.ceil(Number(pagination?.total ?? pagination?.totalItems ?? 0) / Number(pagination?.limit ?? 10))
  );

  return {
    page: Number(pagination?.page ?? pagination?.currentPage ?? page) || page,
    totalPages: Math.max(1, totalPages || 1),
  };
}

export function ActivityLog() {
  const [page, setPage] = useState(1);

  const logsQuery = useQuery({
    queryKey: ["activity-logs", page],
    queryFn: async () => {
      const response = await dashboardApi.getActivityLogs({ page, limit: 10 });
      return {
        rows: extractList<any>(response).map(normalizeActivityLog),
        pagination: extractPagination(response, page),
      };
    },
  });

  const rows = logsQuery.data?.rows ?? [];
  const pagination = logsQuery.data?.pagination ?? { page, totalPages: 1 };

  const tableRows = useMemo(
    () => rows.map((item) => [item.user, item.action, item.module, item.time]),
    [rows]
  );

  return (
    <div className="space-y-6">
      <ResourceNote
        error={logsQuery.error instanceof Error ? logsQuery.error.message : ""}
        loading={logsQuery.isLoading}
        fallbackLabel="activity logs"
      />

      {rows.length ? (
        <GenericTable
          title="Staff Activity Logs"
          description="Assigned tasks, login history, and recent actions."
          headers={["User", "Action", "Module", "Time"]}
          rows={tableRows}
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
          onNextPage={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
        />
      ) : (
        <Empty title="No Activity Logs" description="No staff activity logs were returned by the backend." />
      )}
    </div>
  );
}
